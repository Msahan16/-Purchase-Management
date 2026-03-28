using System;
using System.Collections.Generic;

namespace PurchaseManagement.Api.Entities
{
    public class PurchaseHeader
    {
        public int Id { get; set; }
        public string TransactionNo { get; set; } = string.Empty;
        public DateTime TransactionDate { get; set; } = DateTime.UtcNow;
        public int TotalItems { get; set; }
        public decimal TotalQuantity { get; set; }
        public decimal TotalAmount { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; }

        public ICollection<PurchaseItem> Items { get; set; } = new List<PurchaseItem>();
    }
}
