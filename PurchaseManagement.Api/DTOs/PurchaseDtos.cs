namespace PurchaseManagement.Api.DTOs
{
    public class ItemDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
    }

    public class LocationDto
    {
        public string Id { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
    }

    public class PurchaseItemDto
    {
        public int? Id { get; set; }
        public int ItemId { get; set; }
        public string LocationId { get; set; } = string.Empty;
        public decimal Cost { get; set; }
        public decimal Price { get; set; }
        public decimal Quantity { get; set; }
        public decimal DiscountPercent { get; set; }
        public decimal TotalCost { get; set; }
        public decimal TotalSelling { get; set; }
    }

    public class PurchaseBillDto
    {
        public int? Id { get; set; }
        public string TransactionNo { get; set; } = string.Empty;
        public DateTime TransactionDate { get; set; }
        public int TotalItems { get; set; }
        public decimal TotalQuantity { get; set; }
        public decimal TotalAmount { get; set; }
        public List<PurchaseItemDto> Items { get; set; } = new List<PurchaseItemDto>();
    }
}
