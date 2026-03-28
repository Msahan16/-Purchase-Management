using System;

namespace PurchaseManagement.Api.Entities
{
    public class AuditLog
    {
        public int Id { get; set; }
        public string Entity { get; set; } = string.Empty;
        public string Action { get; set; } = string.Empty;
        public string OldValue { get; set; } = string.Empty;
        public string NewValue { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
