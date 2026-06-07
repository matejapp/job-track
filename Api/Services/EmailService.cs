using Api.Services.Interfaces;
using MailKit.Net.Smtp;
using MimeKit;

namespace Api.Services
{
    public class EmailService : IEmailService
    {
        private readonly IConfiguration _config;

        public EmailService(IConfiguration config)
        {
            _config = config;
        }

        public async Task SendPasswordResetEmailAsync(string toEmail, string resetLink)
        {
            var smtpHost = _config["Email:SmtpHost"] ?? throw new InvalidOperationException("Email:SmtpHost is required");
            var smtpPort = _config.GetValue<int>("Email:SmtpPort", 587);
            var smtpUser = _config["Email:SmtpUser"] ?? throw new InvalidOperationException("Email:SmtpUser is required");
            var smtpPassword = _config["Email:SmtpPassword"] ?? throw new InvalidOperationException("Email:SmtpPassword is required");
            var fromAddress = _config["Email:FromAddress"] ?? throw new InvalidOperationException("Email:FromAddress is required");
            var fromName = _config["Email:FromName"] ?? "JobTrack";

            var message = new MimeMessage();
            message.From.Add(new MailboxAddress(fromName, fromAddress));
            message.To.Add(new MailboxAddress(string.Empty, toEmail));
            message.Subject = "Reset your JobTrack password";

            var body = $"""
                <html>
                <body>
                    <h2>Password Reset</h2>
                    <p>You requested a password reset for your JobTrack account.</p>
                    <p>Click the link below to reset your password. This link expires in 1 hour.</p>
                    <p><a href="{resetLink}">Reset Password</a></p>
                    <p>If you did not request this, please ignore this email.</p>
                </body>
                </html>
                """;

            message.Body = new TextPart("html") { Text = body };

            using var client = new SmtpClient();
            await client.ConnectAsync(smtpHost, smtpPort, MailKit.Security.SecureSocketOptions.StartTls);
            await client.AuthenticateAsync(smtpUser, smtpPassword);
            await client.SendAsync(message);
            await client.DisconnectAsync(true);
        }
    }
}
