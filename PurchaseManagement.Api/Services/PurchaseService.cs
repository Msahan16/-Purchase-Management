using PurchaseManagement.Api.DTOs;
using PurchaseManagement.Api.Entities;
using PurchaseManagement.Api.Repositories;
using System.Text.Json;

namespace PurchaseManagement.Api.Services
{
    public class PurchaseService : IPurchaseService
    {
        private readonly IPurchaseRepository _purchaseRepository;

        public PurchaseService(IPurchaseRepository purchaseRepository)
        {
            _purchaseRepository = purchaseRepository;
        }

        public async Task<PurchaseBillDto?> GetByIdAsync(int id)
        {
            var entity = await _purchaseRepository.GetByIdAsync(id);
            if (entity == null) return null;

            return new PurchaseBillDto
            {
                Id = entity.Id,
                TransactionNo = entity.TransactionNo,
                TransactionDate = entity.TransactionDate,
                TotalItems = entity.TotalItems,
                TotalQuantity = entity.TotalQuantity,
                TotalAmount = entity.TotalAmount,
                Items = entity.Items.Select(i => new PurchaseItemDto
                {
                    Id = i.Id,
                    ItemId = i.ItemId,
                    LocationId = i.LocationId,
                    Cost = i.Cost,
                    Price = i.Price,
                    Quantity = i.Quantity,
                    DiscountPercent = i.DiscountPercent,
                    TotalCost = i.TotalCost,
                    TotalSelling = i.TotalSelling
                }).ToList()
            };
        }

        public async Task<IEnumerable<PurchaseBillDto>> GetAllBillsAsync()
        {
            var entities = await _purchaseRepository.GetAllBillsAsync();
            return entities.Select(e => new PurchaseBillDto
            {
                Id = e.Id,
                TransactionNo = e.TransactionNo,
                TransactionDate = e.TransactionDate,
                TotalItems = e.TotalItems,
                TotalQuantity = e.TotalQuantity,
                TotalAmount = e.TotalAmount
            });
        }

        public async Task<int> CreateAsync(PurchaseBillDto dto)
        {
            var entity = new PurchaseHeader
            {
                TransactionNo = dto.TransactionNo,
                TransactionDate = dto.TransactionDate,
                TotalItems = dto.TotalItems,
                TotalQuantity = dto.TotalQuantity,
                TotalAmount = dto.TotalAmount,
                CreatedAt = DateTime.UtcNow,
                Items = dto.Items.Select(i => new PurchaseItem
                {
                    ItemId = i.ItemId,
                    LocationId = i.LocationId,
                    Cost = i.Cost,
                    Price = i.Price,
                    Quantity = i.Quantity,
                    DiscountPercent = i.DiscountPercent,
                    TotalCost = i.TotalCost,
                    TotalSelling = i.TotalSelling
                }).ToList()
            };

            await _purchaseRepository.CreateAsync(entity);

            // Audit
            await _purchaseRepository.AddAuditLogAsync(new AuditLog
            {
                Entity = "PurchaseHeader",
                Action = "Create",
                OldValue = "",
                NewValue = JsonSerializer.Serialize(entity),
                CreatedAt = DateTime.UtcNow
            });

            return entity.Id;
        }

        public async Task<bool> UpdateAsync(PurchaseBillDto dto)
        {
            var existingEntity = await _purchaseRepository.GetByIdAsync(dto.Id ?? 0);
            if (existingEntity == null) return false;

            var oldValue = JsonSerializer.Serialize(existingEntity);

            // Update header
            existingEntity.TransactionNo = dto.TransactionNo;
            existingEntity.TransactionDate = dto.TransactionDate;
            existingEntity.TotalItems = dto.TotalItems;
            existingEntity.TotalQuantity = dto.TotalQuantity;
            existingEntity.TotalAmount = dto.TotalAmount;
            existingEntity.UpdatedAt = DateTime.UtcNow;

            // Simple replace of items for this sample
            existingEntity.Items.Clear();
            foreach (var item in dto.Items)
            {
                existingEntity.Items.Add(new PurchaseItem
                {
                    PurchaseHeaderId = existingEntity.Id,
                    ItemId = item.ItemId,
                    LocationId = item.LocationId,
                    Cost = item.Cost,
                    Price = item.Price,
                    Quantity = item.Quantity,
                    DiscountPercent = item.DiscountPercent,
                    TotalCost = item.TotalCost,
                    TotalSelling = item.TotalSelling
                });
            }

            await _purchaseRepository.UpdateAsync(existingEntity);

            // Audit
            await _purchaseRepository.AddAuditLogAsync(new AuditLog
            {
                Entity = "PurchaseHeader",
                Action = "Update",
                OldValue = oldValue,
                NewValue = JsonSerializer.Serialize(existingEntity),
                CreatedAt = DateTime.UtcNow
            });

            return true;
        }
    }
}
