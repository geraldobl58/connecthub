import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import * as handlebars from 'handlebars';
import { ConfigService } from '@nestjs/config';

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
      if (error.message.includes('Too many failed login attempts')) {
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
                        <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb; font-weight: bold;">Subdomínio:</td>
                        <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;">
                            <span class="highlight">{{subdomain}}.connecthub.com</span>
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
                            <strong style="color: #1f2937;">Faça seu primeiro login</strong>
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
                <a href="http://localhost:3001/login?tenant={{subdomain}}" class="cta-button" style="background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%); box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);">
                    🚀 Acessar Minha Plataforma
                </a>
                <p style="color: #6b7280; font-size: 13px; margin-top: 10px;">
                    Seu link de acesso: <strong>localhost:3001/login?tenant={{subdomain}}</strong>
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
}
