import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import * as handlebars from 'handlebars';
import { ConfigService } from '@nestjs/config';

export interface WelcomeEmailData {
  companyName: string;
  contactName: string;
  contactEmail: string;
  domain: string;
  plan: string;
  subdomain: string;
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
      });
    } catch (error) {
      console.error('❌ Erro ao enviar email:', {
        error: error.message,
        code: error.code,
        destinatario: data.contactEmail,
      });

      // Retry em caso de rate limiting
      if (error.message.includes('Too many failed login attempts')) {
        console.log('⏰ Aguardando antes de tentar novamente...');
        await new Promise((resolve) => setTimeout(resolve, 60000));

        try {
          const retryResult = await this.transporter.sendMail(mailOptions);
          console.log('✅ Email enviado com sucesso na segunda tentativa!', {
            messageId: retryResult.messageId,
            destinatario: data.contactEmail,
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
                <p><strong>Empresa:</strong> {{companyName}}</p>
                <p><strong>Plano:</strong> {{plan}}</p>
                <p><strong>Subdomínio:</strong> <span class="highlight">{{subdomain}}.connecthub.com</span></p>
                <p><strong>Email do administrador:</strong> {{contactEmail}}</p>
            </div>

            {{#if temporaryPassword}}
            <div class="plan-info">
                <h3>🔐 Suas Credenciais de Acesso</h3>
                <div style="background: #f0fdf4; border: 1px solid #16a34a; border-radius: 8px; padding: 20px; margin: 20px 0;">
                    <p><strong>Email:</strong> {{contactEmail}}</p>
                    <p><strong>Senha Temporária:</strong> <span style="font-family: monospace; background: #ffffff; padding: 6px 12px; border-radius: 4px; border: 1px solid #16a34a; color: #16a34a; font-weight: bold; font-size: 16px;">{{temporaryPassword}}</span></p>
                    <div style="background: #fffbeb; border: 1px solid #f59e0b; border-radius: 6px; padding: 12px; margin-top: 15px;">
                        <p style="color: #92400e; font-size: 14px; margin: 0;">
                            ⚠️ <strong>Política de Senha:</strong> Esta senha contém 1 maiúscula, 1 minúscula, 1 número e 1 símbolo.
                        </p>
                        <p style="color: #92400e; font-size: 14px; margin: 8px 0 0 0;">
                            🔒 <strong>Segurança:</strong> Altere esta senha no primeiro acesso.
                        </p>
                    </div>
                </div>
            </div>
            {{/if}}

            <div class="next-steps">
                <h3>🚀 Próximos passos</h3>
                <ul>
                    <li><strong>Fazer login:</strong> Use as credenciais acima para acessar sua plataforma</li>
                    <li><strong>Alterar senha:</strong> Recomendamos alterar a senha temporária no primeiro acesso</li>
                    <li><strong>Configuração inicial:</strong> Configure sua equipe e parâmetros do sistema</li>
                    <li><strong>Onboarding:</strong> Nossa equipe pode ajudar com a configuração inicial</li>
                    <li><strong>Suporte:</strong> Estamos disponíveis para qualquer dúvida</li>
                </ul>
            </div>

            <p style="text-align: center;">
                <a href="http://localhost:3000/login?tenant={{subdomain}}" class="cta-button">
                    Fazer Login na Plataforma
                </a>
            </p>

            <p>Se você tiver alguma dúvida, não hesite em entrar em contato conosco. Estamos aqui para ajudar!</p>
            
            <p>Atenciosamente,<br>
            <strong>Equipe ConnectHub</strong></p>
        </div>
        
        <div class="footer">
            <p>Este email foi enviado para {{contactEmail}} como confirmação da sua assinatura.</p>
            <p>ConnectHub - A melhor plataforma CRM multi-tenant do Brasil</p>
            <p>📧 suporte@connecthub.com | 📱 (11) 99999-9999</p>
        </div>
    </div>
</body>
</html>
    `;

    return handlebars.compile(template);
  }
}
