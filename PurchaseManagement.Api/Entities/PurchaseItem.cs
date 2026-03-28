namespace PurchaseManagement.Api.Entities
{
    public class PurchaseItem
    {
        public int Id { get; set; }
        public int PurchaseHeaderId { get; set; }
        public PurchaseHeader? PurchaseHeader { get; set; }

        public int ItemId { get; set; }
        public Item? Item { get; set; }

        public string LocationId { get; set; } = string.Empty;
        public Location? Location { get; set; }

        public decimal Cost { get; set; }
        public decimal Price { get; set; }
        public decimal Quantity { get; set; }
        public decimal DiscountPercent { get; set; }

        // Computed logic in code normally, but for DB storage:
        public decimal TotalCost { get; set; }
        public decimal TotalSelling { get; set; }
    }
}
