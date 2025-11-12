import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import * as handlebars from 'handlebars';
import { ConfigService } from '@nestjs/config';

type HandlebarsTemplateDelegate = handlebars.TemplateDelegate;

export interface WelcomeEmailData {
  companyName: string;
  contactName: string;
  contactEmail: string;
  domain: string;
  tenantId: string;
  plan?: string;
  planName?: string;
  planFeatures?: string;
  subdomain?: string;
  temporaryPassword?: string;
}

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService) {
    const mailConfig = {
      host: this.configService.get('MAIL_HOST', 'sandbox.smtp.mailtrap.io'),
      port: parseInt(this.configService.get('MAIL_PORT', '2525')),
      secure: false,
      auth: {
        user: this.configService.get('MAIL_USER', '619b341dfa93e8'),
        pass: this.configService.get('MAIL_PASS', '4c2771fe509498'),
      },
      connectionTimeout: 60000,
      greetingTimeout: 30000,
      socketTimeout: 60000,
      pool: true,
      maxConnections: 5,
      maxMessages: 100,
      requireTLS: false,
      tls: {
        rejectUnauthorized: false,
      },
    };

    this.transporter = nodemailer.createTransport(mailConfig);
    this.validateConfiguration();
  }

  private validateConfiguration(): void {
    const requiredConfig = ['MAIL_HOST', 'MAIL_PORT', 'MAIL_USER', 'MAIL_PASS'];
    const missingConfig = requiredConfig.filter(
      (key) => !this.configService.get(key),
    );

    if (missingConfig.length > 0) {
      console.warn('⚠️ Configurações de email ausentes:', missingConfig);
    }
  }

  async sendWelcomeEmail(data: WelcomeEmailData): Promise<void> {
    const template = this.getWelcomeEmailTemplate();
    const html = template(data);

    const mailOptions = {
      from: `"${this.configService.get('MAIL_FROM_NAME', 'ConnectHub Team')}" <${this.configService.get('MAIL_FROM', 'noreply@connecthub.com')}>`,
      to: data.contactEmail,
      subject: `🎉 Bem-vindo ao ConnectHub, ${data.contactName}!`,
      html,
    };

    try {
      const result = await this.transporter.sendMail(mailOptions);
      console.log('✅ Email de boas-vindas enviado com sucesso!', {
        messageId: result.messageId,
        destinatario: data.contactEmail,
        tenantId: data.tenantId,
      });
    } catch (error) {
      console.error('❌ Erro ao enviar email:', {
        error: error.message,
        code: error.code,
        destinatario: data.contactEmail,
        tenantId: data.tenantId,
      });

      // Retry em caso de rate limiting
      if (error.message.includes('Too many failed signin attempts')) {
        await new Promise((resolve) => setTimeout(resolve, 60000));

        try {
          const retryResult = await this.transporter.sendMail(mailOptions);
          console.log('✅ Email enviado com sucesso na segunda tentativa!', {
            messageId: retryResult.messageId,
            destinatario: data.contactEmail,
            tenantId: data.tenantId,
          });
          return;
        } catch (retryError) {
          throw new Error(
            `Falha ao enviar email após retry: ${retryError.message}`,
          );
        }
      }

      throw new Error(`Falha ao enviar email de boas-vindas: ${error.message}`);
    }
  }

  private getWelcomeEmailTemplate(): handlebars.TemplateDelegate {
    const template = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Bem-vindo ao ConnectHub</title>
    <style>
        body { 
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
            margin: 0; 
            padding: 0; 
            background-color: #f5f7fa; 
        }
        .container { 
            max-width: 600px; 
            margin: 40px auto; 
            background: white; 
            border-radius: 12px; 
            overflow: hidden; 
            box-shadow: 0 4px 20px rgba(0,0,0,0.1); 
        }
        .header { 
            background: linear-gradient(135deg, #3b82f6, #1e40af); 
            color: white; 
            padding: 40px 30px; 
            text-align: center; 
        }
        .header h1 { 
            margin: 0; 
            font-size: 28px; 
            font-weight: 600; 
        }
        .content { 
            padding: 40px 30px; 
        }
        .welcome-box { 
            background: #f8fafc; 
            border-left: 4px solid #3b82f6; 
            padding: 20px; 
            margin: 20px 0; 
            border-radius: 0 8px 8px 0; 
        }
        .plan-info { 
            background: #e0f2fe; 
            border-radius: 8px; 
            padding: 20px; 
            margin: 20px 0; 
        }
        .plan-info h3 { 
            color: #0369a1; 
            margin-top: 0; 
        }
        .next-steps { 
            background: #f0fdf4; 
            border-radius: 8px; 
            padding: 20px; 
            margin: 20px 0; 
        }
        .next-steps h3 { 
            color: #166534; 
            margin-top: 0; 
        }
        .next-steps ul { 
            margin: 10px 0; 
            padding-left: 20px; 
        }
        .next-steps li { 
            margin: 8px 0; 
            color: #374151; 
        }
        .cta-button { 
            display: inline-block; 
            background: #3b82f6; 
            color: white; 
            padding: 12px 24px; 
            text-decoration: none; 
            border-radius: 6px; 
            font-weight: 600; 
            margin: 20px 0; 
        }
        .footer { 
            background: #f8fafc; 
            padding: 30px; 
            text-align: center; 
            color: #6b7280; 
            font-size: 14px; 
        }
        .highlight { 
            color: #3b82f6; 
            font-weight: 600; 
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🎉 Bem-vindo ao ConnectHub!</h1>
            <p>Sua jornada para o sucesso começa agora</p>
        </div>
        
        <div class="content">
            <div class="welcome-box">
                <h2>Olá, {{contactName}}!</h2>
                <p>É com grande prazer que damos as boas-vindas à <strong>{{companyName}}</strong> na família ConnectHub!</p>
                <p>Sua assinatura foi processada com sucesso e sua plataforma CRM já está sendo preparada.</p>
            </div>

            <div class="plan-info">
                <h3>📋 Detalhes da sua assinatura</h3>
                <table style="width: 100%; border-collapse: collapse; margin: 15px 0;">
                    <tr>
                        <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb; font-weight: bold; width: 40%;">Empresa:</td>
                        <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;">{{companyName}}</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb; font-weight: bold;">Plano:</td>
                        <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;">
                            <span class="highlight">{{plan}}</span>
                            {{#if planFeatures}}
                            <br><small style="color: #6b7280;">{{planFeatures}}</small>
                            {{/if}}
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb; font-weight: bold;">Subdomínio/TenantId:</td>
                        <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;">
                            <span class="highlight">{{subdomain}}</span>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb; font-weight: bold;">Email Admin:</td>
                        <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;">{{contactEmail}}</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb; font-weight: bold;">ID da Conta:</td>
                        <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;">
                            <code style="background: #f3f4f6; padding: 2px 6px; border-radius: 3px; font-size: 11px; color: #4b5563;">{{tenantId}}</code>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb; font-weight: bold;">Slug/TenantId:</td>
                        <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;">
                            <code style="background: #f3f4f6; padding: 2px 6px; border-radius: 3px; font-size: 11px; color: #4b5563;">{{domain}}</code>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 8px 0; font-weight: bold;">Status:</td>
                        <td style="padding: 8px 0;">
                            <span style="background: #10b981; color: white; padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: bold;">
                                ✅ ATIVO
                            </span>
                        </td>
                    </tr>
                </table>
            </div>

            {{#if temporaryPassword}}
            <div class="plan-info">
                <h3>🔐 Suas Credenciais de Acesso</h3>
                <div style="background: #f0fdf4; border: 2px solid #16a34a; border-radius: 8px; padding: 25px; margin: 20px 0;">
                    <table style="width: 100%; border-collapse: collapse;">
                        <tr>
                            <td style="padding: 8px 0; font-weight: bold; width: 30%;">Email:</td>
                            <td style="padding: 8px 0; font-family: monospace; color: #0369a1;">{{contactEmail}}</td>
                        </tr>
                        <tr>
                            <td style="padding: 8px 0; font-weight: bold;">Senha:</td>
                            <td style="padding: 8px 0;">
                                <span style="font-family: 'Courier New', monospace; background: #ffffff; padding: 8px 16px; border-radius: 6px; border: 2px solid #16a34a; color: #16a34a; font-weight: bold; font-size: 18px; letter-spacing: 1px;">{{temporaryPassword}}</span>
                            </td>
                        </tr>
                    </table>
                    
                    <div style="background: #fffbeb; border: 1px solid #f59e0b; border-radius: 6px; padding: 15px; margin-top: 20px;">
                        <div style="display: flex; align-items: flex-start; gap: 10px;">
                            <span style="font-size: 18px;">🔒</span>
                            <div>
                                <p style="color: #92400e; font-size: 14px; margin: 0 0 8px 0; font-weight: bold;">
                                    Política de Segurança da Senha
                                </p>
                                <p style="color: #92400e; font-size: 13px; margin: 0 0 5px 0;">
                                    ✅ Contém pelo menos 1 letra maiúscula (A-Z)
                                </p>
                                <p style="color: #92400e; font-size: 13px; margin: 0 0 5px 0;">
                                    ✅ Contém pelo menos 1 letra minúscula (a-z)
                                </p>
                                <p style="color: #92400e; font-size: 13px; margin: 0 0 5px 0;">
                                    ✅ Contém pelo menos 1 número (0-9)
                                </p>
                                <p style="color: #92400e; font-size: 13px; margin: 0 0 10px 0;">
                                    ✅ Contém pelo menos 1 símbolo (!@#$%&*)
                                </p>
                                <p style="color: #dc2626; font-size: 14px; margin: 0; font-weight: bold;">
                                    ⚠️ IMPORTANTE: Altere esta senha no primeiro acesso por segurança.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {{/if}}

            <div class="next-steps">
                <h3>🚀 Primeiros Passos na Plataforma</h3>
                <div style="display: grid; gap: 15px;">
                    <div style="display: flex; align-items: flex-start; gap: 12px;">
                        <span style="background: #3b82f6; color: white; border-radius: 50%; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 12px; flex-shrink: 0;">1</span>
                        <div>
                            <strong style="color: #1f2937;">Faça seu primeiro acesso</strong>
                            <p style="margin: 5px 0 0 0; color: #4b5563; font-size: 14px;">Use suas credenciais para acessar a plataforma e familiarize-se com a interface</p>
                        </div>
                    </div>
                    
                    <div style="display: flex; align-items: flex-start; gap: 12px;">
                        <span style="background: #10b981; color: white; border-radius: 50%; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 12px; flex-shrink: 0;">2</span>
                        <div>
                            <strong style="color: #1f2937;">Altere sua senha</strong>
                            <p style="margin: 5px 0 0 0; color: #4b5563; font-size: 14px;">Por segurança, crie uma senha personalizada em Configurações > Perfil</p>
                        </div>
                    </div>
                    
                    <div style="display: flex; align-items: flex-start; gap: 12px;">
                        <span style="background: #f59e0b; color: white; border-radius: 50%; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 12px; flex-shrink: 0;">3</span>
                        <div>
                            <strong style="color: #1f2937;">Configure sua empresa</strong>
                            <p style="margin: 5px 0 0 0; color: #4b5563; font-size: 14px;">Adicione logotipo, informações da empresa e personalize as configurações</p>
                        </div>
                    </div>
                    
                    <div style="display: flex; align-items: flex-start; gap: 12px;">
                        <span style="background: #8b5cf6; color: white; border-radius: 50%; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 12px; flex-shrink: 0;">4</span>
                        <div>
                            <strong style="color: #1f2937;">Adicione sua equipe</strong>
                            <p style="margin: 5px 0 0 0; color: #4b5563; font-size: 14px;">Convide usuários e configure permissões em Configurações > Usuários</p>
                        </div>
                    </div>
                    
                    <div style="display: flex; align-items: flex-start; gap: 12px;">
                        <span style="background: #ef4444; color: white; border-radius: 50%; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 12px; flex-shrink: 0;">5</span>
                        <div>
                            <strong style="color: #1f2937;">Importe seus dados</strong>
                            <p style="margin: 5px 0 0 0; color: #4b5563; font-size: 14px;">Importe contatos, propriedades e dados existentes usando nossas ferramentas</p>
                        </div>
                    </div>
                </div>
                
                <div style="background: #e0f2fe; border: 1px solid #0891b2; border-radius: 6px; padding: 15px; margin-top: 20px;">
                    <p style="color: #0c4a6e; font-size: 14px; margin: 0; text-align: center;">
                        💡 <strong>Dica:</strong> Precisa de ajuda? Nossa equipe oferece onboarding gratuito para novos clientes!
                    </p>
                </div>
            </div>

            <div style="text-align: center; margin: 30px 0;">
                <a href="http://localhost:3001/signin?tenant={{subdomain}}" class="cta-button" style="background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%); box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);">
                    🚀 Acessar Minha Plataforma
                </a>
                <p style="color: #6b7280; font-size: 13px; margin-top: 10px;">
                    Seu link de acesso: <strong>localhost:3001/signin?tenant={{subdomain}}</strong>
                </p>
            </div>

            <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px; margin: 25px 0;">
                <h4 style="color: #1f2937; margin: 0 0 15px 0;">📞 Suporte e Contato</h4>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; font-size: 14px;">
                    <div>
                        <strong style="color: #374151;">📧 Email:</strong><br>
                        <a href="mailto:suporte@connecthub.com" style="color: #3b82f6;">suporte@connecthub.com</a>
                    </div>
                    <div>
                        <strong style="color: #374151;">📱 Telefone:</strong><br>
                        <a href="tel:+5511999999999" style="color: #3b82f6;">(11) 99999-9999</a>
                    </div>
                    <div>
                        <strong style="color: #374151;">💬 Chat:</strong><br>
                        <span style="color: #6b7280;">Disponível na plataforma</span>
                    </div>
                    <div>
                        <strong style="color: #374151;">🕒 Horário:</strong><br>
                        <span style="color: #6b7280;">Seg-Sex, 8h às 18h</span>
                    </div>
                </div>
            </div>

            <p style="color: #374151; line-height: 1.6;">
                Se você tiver alguma dúvida ou precisar de assistência, nossa equipe está sempre pronta para ajudar. 
                Não hesite em entrar em contato conosco através de qualquer um dos canais acima.
            </p>
            
            <p style="margin-top: 30px; color: #374151;">
                Atenciosamente,<br>
                <strong style="color: #1f2937;">Equipe ConnectHub</strong><br>
                <em style="color: #6b7280; font-size: 14px;">Sua plataforma CRM de confiança</em>
            </p>
        </div>
        
        <div class="footer">
            <div style="border-top: 2px solid #e5e7eb; padding-top: 20px; margin-top: 20px;">
                <p style="margin: 0 0 10px 0; font-weight: 600; color: #374151;">
                    ConnectHub - A plataforma CRM multi-tenant mais avançada do Brasil
                </p>
                <p style="margin: 0 0 15px 0; color: #6b7280; font-size: 13px;">
                    Este email foi enviado para <strong>{{contactEmail}}</strong> como confirmação da sua assinatura do plano <strong>{{plan}}</strong>.
                </p>
                
                <div style="display: flex; justify-content: center; align-items: center; gap: 20px; margin: 15px 0; flex-wrap: wrap;">
                    <a href="mailto:suporte@connecthub.com" style="color: #3b82f6; text-decoration: none; font-size: 13px;">
                        📧 suporte@connecthub.com
                    </a>
                    <span style="color: #d1d5db;">|</span>
                    <a href="tel:+5511999999999" style="color: #3b82f6; text-decoration: none; font-size: 13px;">
                        📱 (11) 99999-9999
                    </a>
                    <span style="color: #d1d5db;">|</span>
                    <a href="https://connecthub.com" style="color: #3b82f6; text-decoration: none; font-size: 13px;">
                        🌐 connecthub.com
                    </a>
                </div>
                
                <p style="margin: 15px 0 0 0; color: #9ca3af; font-size: 12px;">
                    © 2025 ConnectHub. Todos os direitos reservados.<br>
                    Você está recebendo este email porque se cadastrou em nossa plataforma.
                </p>
            </div>
        </div>
    </div>
</body>
</html>
    `;

    return handlebars.compile(template);
  }

  async sendPasswordResetEmail(
    email: string,
    name: string,
    token: string,
    tenantSlug: string,
  ): Promise<void> {
    const resetUrl = `${this.configService.get('FRONTEND_URL', 'http://localhost:3000')}/auth/reset-password?token=${token}`;

    const template = this.getPasswordResetEmailTemplate();
    const html = template({
      name,
      resetUrl,
      tenantSlug,
    });

    const mailOptions = {
      from: `"${this.configService.get('MAIL_FROM_NAME', 'ConnectHub Team')}" <${this.configService.get('MAIL_FROM', 'noreply@connecthub.com')}>`,
      to: email,
      subject: '🔒 Recuperação de Senha - ConnectHub',
      html,
    };

    try {
      const result = await this.transporter.sendMail(mailOptions);
      console.log('✅ Email de recuperação enviado com sucesso!', {
        messageId: result.messageId,
        destinatario: email,
      });
    } catch (error) {
      console.error('❌ Erro ao enviar email de recuperação:', {
        error: error.message,
        destinatario: email,
      });
      throw new Error(`Falha ao enviar email: ${error.message}`);
    }
  }

  private getPasswordResetEmailTemplate() {
    const template = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Recuperação de Senha - ConnectHub</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f3f4f6;">
    <div style="max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); padding: 40px 30px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 700;">
                🔒 Recuperação de Senha
            </h1>
            <p style="color: #e0e7ff; margin: 10px 0 0 0; font-size: 16px;">
                Recebemos uma solicitação para redefinir sua senha
            </p>
        </div>
        
        <!-- Content -->
        <div style="padding: 40px 30px;">
            <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                Olá <strong>{{name}}</strong>,
            </p>
            
            <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                Recebemos uma solicitação para redefinir a senha da sua conta no ConnectHub. Se você não fez essa solicitação, pode ignorar este email com segurança.
            </p>

            <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 30px 0;">
                Para redefinir sua senha, clique no botão abaixo:
            </p>

            <!-- Reset Button -->
            <div style="text-align: center; margin: 30px 0;">
                <a href="{{resetUrl}}" style="display: inline-block; background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); color: #ffffff; text-decoration: none; padding: 16px 40px; border-radius: 8px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 6px rgba(59, 130, 246, 0.3);">
                    🔑 Redefinir Senha
                </a>
            </div>

            <!-- Security Notice -->
            <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 16px; border-radius: 6px; margin: 30px 0;">
                <p style="margin: 0; color: #92400e; font-size: 14px; line-height: 1.6;">
                    <strong>⚠️ Aviso de Segurança:</strong><br>
                    Este link é válido por <strong>1 hora</strong>. Se você não solicitou esta alteração, recomendamos que altere sua senha imediatamente e entre em contato com nossa equipe de suporte.
                </p>
            </div>

            <p style="color: #6b7280; font-size: 14px; line-height: 1.6; margin: 20px 0 0 0;">
                Se o botão não funcionar, copie e cole o link abaixo em seu navegador:
            </p>
            <p style="color: #3b82f6; font-size: 13px; word-break: break-all; background-color: #f3f4f6; padding: 12px; border-radius: 6px; margin: 10px 0 0 0;">
                {{resetUrl}}
            </p>

            <div style="margin-top: 30px; padding-top: 30px; border-top: 1px solid #e5e7eb;">
                <p style="color: #374151; font-size: 14px; line-height: 1.6; margin: 0;">
                    Atenciosamente,<br>
                    <strong>Equipe ConnectHub</strong>
                </p>
            </div>
        </div>
        
        <!-- Footer -->
        <div style="background-color: #f9fafb; padding: 30px; text-align: center; border-top: 1px solid #e5e7eb;">
            <p style="margin: 0 0 10px 0; color: #6b7280; font-size: 13px;">
                Este é um email automático. Por favor, não responda.
            </p>
            <p style="margin: 0 0 15px 0; color: #9ca3af; font-size: 12px;">
                © 2025 ConnectHub. Todos os direitos reservados.
            </p>
            <div style="margin-top: 15px;">
                <a href="mailto:suporte@connecthub.com" style="color: #3b82f6; text-decoration: none; font-size: 13px; margin: 0 10px;">
                    📧 Suporte
                </a>
                <span style="color: #d1d5db;">|</span>
                <a href="https://connecthub.com" style="color: #3b82f6; text-decoration: none; font-size: 13px; margin: 0 10px;">
                    🌐 Website
                </a>
            </div>
        </div>
    </div>
</body>
</html>
    `;

    return handlebars.compile(template);
  }

  async sendLimitAlert(data: {
    companyName: string;
    contactName: string;
    contactEmail: string;
    limitType: string; // 'properties' | 'users' | 'contacts'
    currentUsage: number;
    maxLimit: number;
    percentageUsed: number;
    planName: string;
  }): Promise<void> {
    const template = this.getLimitAlertTemplate();
    const html = template(data);

    const mailOptions = {
      from: `"${this.configService.get('MAIL_FROM_NAME', 'ConnectHub Team')}" <${this.configService.get('MAIL_FROM', 'noreply@connecthub.com')}>`,
      to: data.contactEmail,
      subject: `⚠️ Aviso: Você está usando ${data.percentageUsed.toFixed(0)}% do seu limite de ${data.limitType}`,
      html,
    };

    try {
      const result = await this.transporter.sendMail(mailOptions);
      console.log('✅ Email de alerta de limite enviado!', {
        messageId: result.messageId,
        destinatario: data.contactEmail,
        limitType: data.limitType,
        percentageUsed: data.percentageUsed,
      });
    } catch (error) {
      console.error('❌ Erro ao enviar email de alerta:', {
        error: error.message,
        destinatario: data.contactEmail,
      });
      throw error;
    }
  }

  private getLimitAlertTemplate(): HandlebarsTemplateDelegate {
    const template = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Alerta de Limite - ConnectHub</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f3f4f6;">
    <div style="max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
        
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); padding: 40px 30px; text-align: center;">
            <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700;">
                ⚠️ Alerta de Limite
            </h1>
            <p style="margin: 10px 0 0 0; color: #fef3c7; font-size: 16px;">
                {{companyName}}
            </p>
        </div>
        
        <!-- Content -->
        <div style="padding: 40px 30px;">
            <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                Olá <strong>{{contactName}}</strong>,
            </p>
            
            <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                Você está próximo do limite do seu plano <strong>{{planName}}</strong>.
            </p>

            <!-- Usage Stats Box -->
            <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 20px; border-radius: 8px; margin: 30px 0;">
                <h3 style="margin: 0 0 15px 0; color: #92400e; font-size: 18px;">
                    📊 Uso Atual
                </h3>
                <div style="margin-bottom: 10px;">
                    <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                        <span style="color: #78350f; font-size: 14px;">{{limitType}}</span>
                        <span style="color: #78350f; font-size: 14px; font-weight: 600;">{{currentUsage}} / {{maxLimit}}</span>
                    </div>
                    <div style="background-color: #fef3c7; border-radius: 10px; height: 20px; overflow: hidden;">
                        <div style="background: linear-gradient(90deg, #f59e0b 0%, #d97706 100%); height: 100%; width: {{percentageUsed}}%; transition: width 0.3s ease;"></div>
                    </div>
                    <p style="margin: 8px 0 0 0; color: #92400e; font-size: 16px; font-weight: 700;">
                        {{percentageUsed}}% utilizado
                    </p>
                </div>
            </div>

            <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                Para continuar aproveitando todos os recursos sem interrupções, considere fazer upgrade do seu plano.
            </p>

            <!-- Upgrade Button -->
            <div style="text-align: center; margin: 30px 0;">
                <a href="https://connecthub.com/dashboard/settings?tab=planos" style="display: inline-block; background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); color: #ffffff; text-decoration: none; padding: 16px 40px; border-radius: 8px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 6px rgba(59, 130, 246, 0.3);">
                    🚀 Fazer Upgrade
                </a>
            </div>

            <!-- Benefits Box -->
            <div style="background-color: #eff6ff; padding: 20px; border-radius: 8px; margin: 30px 0;">
                <h4 style="margin: 0 0 15px 0; color: #1e40af; font-size: 16px;">
                    ✨ Benefícios do Upgrade
                </h4>
                <ul style="margin: 0; padding-left: 20px; color: #1e3a8a;">
                    <li style="margin-bottom: 8px;">Mais {{limitType}} para gerenciar</li>
                    <li style="margin-bottom: 8px;">Recursos avançados</li>
                    <li style="margin-bottom: 8px;">Suporte prioritário</li>
                    <li>Acesso completo à API</li>
                </ul>
            </div>

            <div style="margin-top: 30px; padding-top: 30px; border-top: 1px solid #e5e7eb;">
                <p style="color: #374151; font-size: 14px; line-height: 1.6; margin: 0;">
                    Atenciosamente,<br>
                    <strong>Equipe ConnectHub</strong>
                </p>
            </div>
        </div>
        
        <!-- Footer -->
        <div style="background-color: #f9fafb; padding: 30px; text-align: center; border-top: 1px solid #e5e7eb;">
            <p style="margin: 0 0 10px 0; color: #6b7280; font-size: 13px;">
                Este é um email automático. Por favor, não responda.
            </p>
            <p style="margin: 0 0 15px 0; color: #9ca3af; font-size: 12px;">
                © 2025 ConnectHub. Todos os direitos reservados.
            </p>
            <div style="margin-top: 15px;">
                <a href="mailto:suporte@connecthub.com" style="color: #3b82f6; text-decoration: none; font-size: 13px; margin: 0 10px;">
                    📧 Suporte
                </a>
                <span style="color: #d1d5db;">|</span>
                <a href="https://connecthub.com" style="color: #3b82f6; text-decoration: none; font-size: 13px; margin: 0 10px;">
                    🌐 Website
                </a>
            </div>
        </div>
    </div>
</body>
</html>
    `;

    return handlebars.compile(template);
  }

  async sendCancellationEmail(data: {
    companyName: string;
    contactName: string;
    contactEmail: string;
    planName: string;
    expirationDate: string;
  }): Promise<void> {
    // Formatar a data para formato legível
    const expirationDate = new Date(data.expirationDate);
    const formattedDate = expirationDate.toLocaleDateString('pt-BR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'America/Sao_Paulo',
    });

    const template = this.getCancellationEmailTemplate();
    const html = template({
      ...data,
      expirationDate: formattedDate,
    });

    const mailOptions = {
      from: `"${this.configService.get('MAIL_FROM_NAME', 'ConnectHub Team')}" <${this.configService.get('MAIL_FROM', 'noreply@connecthub.com')}>`,
      to: data.contactEmail,
      subject: '❌ Sua assinatura ConnectHub foi cancelada',
      html,
    };

    try {
      const result = await this.transporter.sendMail(mailOptions);
      console.log('✅ Email de cancelamento enviado com sucesso!', {
        messageId: result.messageId,
        destinatario: data.contactEmail,
      });
    } catch (error) {
      console.error('❌ Erro ao enviar email de cancelamento:', {
        error: error.message,
        destinatario: data.contactEmail,
      });
      throw error;
    }
  }

  private getCancellationEmailTemplate(): HandlebarsTemplateDelegate {
    const template = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Assinatura Cancelada - ConnectHub</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f3f4f6;">
    <div style="max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
        
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); padding: 40px 30px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 700;">
                ❌ Assinatura Cancelada
            </h1>
            <p style="color: #fee2e2; margin: 10px 0 0 0; font-size: 16px;">
                {{companyName}}
            </p>
        </div>
        
        <!-- Content -->
        <div style="padding: 40px 30px;">
            <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                Olá <strong>{{contactName}}</strong>,
            </p>
            
            <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                Confirmamos que sua assinatura do plano <strong>{{planName}}</strong> foi cancelada com sucesso.
            </p>

            <!-- Important Information -->
            <div style="background-color: #fef2f2; border-left: 4px solid #ef4444; padding: 20px; border-radius: 8px; margin: 30px 0;">
                <h3 style="margin: 0 0 15px 0; color: #7f1d1d; font-size: 18px;">
                    📋 Informações Importantes
                </h3>
                
                <div style="margin-bottom: 15px; padding-bottom: 15px; border-bottom: 1px solid #fca5a5;">
                    <p style="margin: 0 0 5px 0; color: #7f1d1d; font-size: 14px; font-weight: 600;">
                        ✅ Seu acesso continuará até:
                    </p>
                    <p style="margin: 0; color: #991b1b; font-size: 18px; font-weight: 700;">
                        {{expirationDate}}
                    </p>
                </div>

                <p style="margin: 0; color: #7f1d1d; font-size: 14px; line-height: 1.6;">
                    Você terá acesso completo a todos os recursos do plano {{planName}} até a data acima. Após essa data, sua conta será downgrade para o plano gratuito (se disponível).
                </p>
            </div>

            <!-- Next Steps -->
            <div style="background-color: #f0fdf4; border-left: 4px solid #16a34a; padding: 20px; border-radius: 8px; margin: 30px 0;">
                <h3 style="margin: 0 0 15px 0; color: #166534; font-size: 16px;">
                    🔄 O que você pode fazer durante este período
                </h3>
                <ul style="margin: 0; padding-left: 20px; color: #166534;">
                    <li style="margin-bottom: 12px; padding-bottom: 12px; border-bottom: 1px solid #bbf7d0;">
                        <strong>📥 Exportar dados:</strong> Exporte todos os seus contatos, propriedades e dados importantes em formato CSV/Excel
                    </li>
                    <li style="margin-bottom: 12px; padding-bottom: 12px; border-bottom: 1px solid #bbf7d0;">
                        <strong>📊 Relatórios finais:</strong> Gere relatórios completos enquanto tem acesso aos dados
                    </li>
                    <li style="margin-bottom: 12px; padding-bottom: 12px; border-bottom: 1px solid #bbf7d0;">
                        <strong>🔗 Integrações:</strong> Desconecte integrações e resgate qualquer API key necessária
                    </li>
                    <li style="margin-bottom: 12px; padding-bottom: 12px; border-bottom: 1px solid #bbf7d0;">
                        <strong>👥 Permissões:</strong> Gerenciar acessos da equipe e fazer transição de responsabilidades
                    </li>
                    <li style="margin-bottom: 12px; padding-bottom: 12px; border-bottom: 1px solid #bbf7d0;">
                        <strong>💾 Backup manual:</strong> Crie backups manuais de informações críticas
                    </li>
                    <li>
                        <strong>🔄 Reativar a qualquer tempo:</strong> Você pode reativar sua assinatura a qualquer momento sem perder dados
                    </li>
                </ul>
            </div>

            <!-- Important Notice -->
            <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 20px; border-radius: 8px; margin: 30px 0;">
                <h4 style="margin: 0 0 12px 0; color: #92400e; font-size: 15px;">
                    ⚠️ Informações Importantes sobre Retenção de Dados
                </h4>
                <ul style="margin: 0; padding-left: 20px; color: #92400e;">
                    <li style="margin-bottom: 8px;">
                        <strong>Acesso contínuo:</strong> Você tem acesso completo até {{expirationDate}}
                    </li>
                    <li style="margin-bottom: 8px;">
                        <strong>Após expiração:</strong> Conta será movida para plano gratuito (se disponível) com funcionalidades limitadas
                    </li>
                    <li style="margin-bottom: 8px;">
                        <strong>Dados preservados:</strong> Seus dados serão mantidos por 90 dias após cancelamento
                    </li>
                    <li>
                        <strong>Reativação:</strong> Ao reativar, seus dados estarão intactos e disponíveis imediatamente
                    </li>
                </ul>
            </div>

            <!-- Why Did We Cancel -->
            <div style="background-color: #faf5ff; border: 1px solid #e9d5ff; border-radius: 8px; padding: 20px; margin: 30px 0;">
                <h4 style="margin: 0 0 12px 0; color: #6b21a8; font-size: 15px;">
                    ❓ Seu plano expirará em
                </h4>
                <p style="margin: 0; color: #6b21a8; font-size: 14px; line-height: 1.6;">
                    <strong>{{expirationDate}}</strong>
                </p>
                <p style="margin: 10px 0 0 0; color: #6b21a8; font-size: 13px; line-height: 1.6;">
                    Após essa data, sua conta passará para o plano gratuito. Você receberá um email de confirmação quando o plano expirar.
                </p>
            </div>

            <!-- Reactivate Option -->
            <div style="text-align: center; margin: 30px 0;">
                <p style="color: #374151; font-size: 14px; line-height: 1.6; margin: 0 0 20px 0;">
                    Mudou de ideia? Você pode reativar sua assinatura a qualquer momento
                </p>
                <a href="https://connecthub.com/dashboard/plans" style="display: inline-block; background: linear-gradient(135deg, #16a34a 0%, #15803d 100%); color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 600; font-size: 15px; box-shadow: 0 4px 6px rgba(22, 163, 74, 0.3);">
                    🔄 Reativar Assinatura
                </a>
            </div>

            <!-- Contact Support -->
            <div style="background-color: #f0f9ff; padding: 20px; border-radius: 8px; margin: 30px 0; text-align: center;">
                <h4 style="margin: 0 0 12px 0; color: #0369a1; font-size: 15px;">
                    💬 Precisa de Ajuda?
                </h4>
                <p style="margin: 0 0 15px 0; color: #0c4a6e; font-size: 14px; line-height: 1.6;">
                    Nossa equipe de suporte está pronta para ajudar com qualquer dúvida sobre o cancelamento.
                </p>
                <a href="mailto:suporte@connecthub.com" style="display: inline-block; color: #0369a1; text-decoration: none; font-weight: 600; font-size: 14px;">
                    📧 Contatar Suporte
                </a>
            </div>

            <div style="margin-top: 30px; padding-top: 30px; border-top: 1px solid #e5e7eb;">
                <p style="color: #374151; font-size: 14px; line-height: 1.6; margin: 0;">
                    Atenciosamente,<br>
                    <strong>Equipe ConnectHub</strong>
                </p>
            </div>
        </div>
        
        <!-- Footer -->
        <div style="background-color: #f9fafb; padding: 30px; text-align: center; border-top: 1px solid #e5e7eb;">
            <p style="margin: 0 0 10px 0; color: #6b7280; font-size: 13px;">
                Este é um email automático relacionado ao cancelamento de sua assinatura.
            </p>
            <p style="margin: 0 0 15px 0; color: #9ca3af; font-size: 12px;">
                © 2025 ConnectHub. Todos os direitos reservados.
            </p>
            <div style="margin-top: 15px;">
                <a href="mailto:suporte@connecthub.com" style="color: #3b82f6; text-decoration: none; font-size: 13px; margin: 0 10px;">
                    📧 Suporte
                </a>
                <span style="color: #d1d5db;">|</span>
                <a href="https://connecthub.com" style="color: #3b82f6; text-decoration: none; font-size: 13px; margin: 0 10px;">
                    🌐 Website
                </a>
            </div>
        </div>
    </div>
</body>
</html>
    `;

    return handlebars.compile(template);
  }

  async sendUpgradeEmail(data: {
    companyName: string;
    contactName: string;
    contactEmail: string;
    oldPlanName: string;
    newPlanName: string;
    newPlanPrice: number;
    currency: string;
    newMaxUsers?: number;
    newMaxContacts?: number;
    hasAPI: boolean;
  }): Promise<void> {
    const template = this.getUpgradeEmailTemplate();
    const html = template(data);

    const mailOptions = {
      from: `"${this.configService.get('MAIL_FROM_NAME', 'ConnectHub Team')}" <${this.configService.get('MAIL_FROM', 'noreply@connecthub.com')}>`,
      to: data.contactEmail,
      subject: '🚀 Parabéns! Seu plano foi atualizado com sucesso',
      html,
    };

    try {
      const result = await this.transporter.sendMail(mailOptions);
      console.log('✅ Email de upgrade enviado com sucesso!', {
        messageId: result.messageId,
        destinatario: data.contactEmail,
        oldPlan: data.oldPlanName,
        newPlan: data.newPlanName,
      });
    } catch (error) {
      console.error('❌ Erro ao enviar email de upgrade:', {
        error: error.message,
        destinatario: data.contactEmail,
      });
      throw error;
    }
  }

  private getUpgradeEmailTemplate(): HandlebarsTemplateDelegate {
    const template = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Plano Atualizado - ConnectHub</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f3f4f6;">
    <div style="max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
        
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 40px 30px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 700;">
                🚀 Plano Atualizado!
            </h1>
            <p style="color: #d1fae5; margin: 10px 0 0 0; font-size: 16px;">
                {{companyName}}
            </p>
        </div>
        
        <!-- Content -->
        <div style="padding: 40px 30px;">
            <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                Olá <strong>{{contactName}}</strong>,
            </p>
            
            <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 30px 0;">
                Que alegria! Sua assinatura foi atualizada com sucesso. Agora você tem acesso a todos os recursos premium do plano <strong>{{newPlanName}}</strong>.
            </p>

            <!-- Plan Upgrade Info -->
            <div style="background-color: #f0fdf4; border-left: 4px solid #10b981; padding: 20px; border-radius: 8px; margin: 30px 0;">
                <h3 style="margin: 0 0 15px 0; color: #166534; font-size: 16px;">
                    📊 Seu Novo Plano
                </h3>
                
                <div style="margin-bottom: 12px; padding-bottom: 12px; border-bottom: 1px solid #bbf7d0;">
                    <p style="margin: 0; color: #374151; font-size: 14px;">
                        <strong>Plano anterior:</strong> <span style="color: #6b7280;">{{oldPlanName}}</span>
                    </p>
                </div>
                
                <div style="margin-bottom: 12px; padding-bottom: 12px; border-bottom: 1px solid #bbf7d0;">
                    <p style="margin: 0; color: #374151; font-size: 14px;">
                        <strong>Novo plano:</strong> <span style="color: #10b981; font-weight: 700;">{{newPlanName}}</span>
                    </p>
                </div>

                <div style="margin-bottom: 12px; padding-bottom: 12px; border-bottom: 1px solid #bbf7d0;">
                    <p style="margin: 0; color: #374151; font-size: 14px;">
                        <strong>Valor:</strong> <span style="font-size: 18px; font-weight: 700; color: #10b981;">{{currency}}{{newPlanPrice}}</span> por mês
                    </p>
                </div>

                <div>
                    <p style="margin: 0 0 8px 0; color: #166534; font-size: 14px; font-weight: 600;">
                        Seus novos recursos incluem:
                    </p>
                    <ul style="margin: 8px 0; padding-left: 20px; color: #166534;">
                        <li style="margin-bottom: 6px;">✅ {{newMaxUsers}} usuários</li>
                        <li style="margin-bottom: 6px;">✅ {{newMaxContacts}} contatos</li>
                        {{#if hasAPI}}<li style="margin-bottom: 6px;">✅ Acesso completo à API</li>{{/if}}
                    </ul>
                </div>
            </div>

            <!-- Next Steps -->
            <div style="background-color: #eff6ff; border-left: 4px solid #3b82f6; padding: 20px; border-radius: 8px; margin: 30px 0;">
                <h4 style="margin: 0 0 12px 0; color: #1e40af; font-size: 15px;">
                    ✨ Próximos Passos
                </h4>
                <ul style="margin: 0; padding-left: 20px; color: #1e40af;">
                    <li style="margin-bottom: 8px;">Explore os novos recursos da sua conta</li>
                    <li style="margin-bottom: 8px;">Convidar mais usuários para sua equipe</li>
                    <li style="margin-bottom: 8px;">Integre com suas ferramentas favoritas</li>
                    <li>Aproveite o suporte prioritário</li>
                </ul>
            </div>

            <!-- Support -->
            <div style="text-align: center; margin: 30px 0; padding: 20px; background-color: #f9fafb; border-radius: 8px;">
                <p style="color: #374151; font-size: 14px; line-height: 1.6; margin: 0;">
                    Dúvidas sobre suas novas funcionalidades?<br>
                    <a href="mailto:suporte@connecthub.com" style="color: #3b82f6; text-decoration: none; font-weight: 600;">
                        Entre em contato com nosso suporte
                    </a>
                </p>
            </div>

            <div style="margin-top: 30px; padding-top: 30px; border-top: 1px solid #e5e7eb;">
                <p style="color: #374151; font-size: 14px; line-height: 1.6; margin: 0;">
                    Atenciosamente,<br>
                    <strong>Equipe ConnectHub</strong>
                </p>
            </div>
        </div>
        
        <!-- Footer -->
        <div style="background-color: #f9fafb; padding: 30px; text-align: center; border-top: 1px solid #e5e7eb;">
            <p style="margin: 0 0 10px 0; color: #6b7280; font-size: 13px;">
                Obrigado por escolher ConnectHub!
            </p>
            <p style="margin: 0 0 15px 0; color: #9ca3af; font-size: 12px;">
                © 2025 ConnectHub. Todos os direitos reservados.
            </p>
            <div style="margin-top: 15px;">
                <a href="mailto:suporte@connecthub.com" style="color: #3b82f6; text-decoration: none; font-size: 13px; margin: 0 10px;">
                    📧 Suporte
                </a>
                <span style="color: #d1d5db;">|</span>
                <a href="https://connecthub.com" style="color: #3b82f6; text-decoration: none; font-size: 13px; margin: 0 10px;">
                    🌐 Website
                </a>
            </div>
        </div>
    </div>
</body>
</html>
    `;

    return handlebars.compile(template);
  }
}
