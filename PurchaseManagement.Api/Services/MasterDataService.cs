using PurchaseManagement.Api.DTOs;
using PurchaseManagement.Api.Repositories;

namespace PurchaseManagement.Api.Services
{
    public class MasterDataService : IMasterDataService
    {
        private readonly IMasterDataRepository _repository;

        public MasterDataService(IMasterDataRepository repository)
        {
            _repository = repository;
        }

        public async Task<IEnumerable<ItemDto>> GetItemsAsync()
        {
            var items = await _repository.GetItemsAsync();
            return items.Select(i => new ItemDto { Id = i.Id, Name = i.Name });
        }

        public async Task<IEnumerable<LocationDto>> GetLocationsAsync()
        {
            var locations = await _repository.GetLocationsAsync();
            return locations.Select(l => new LocationDto { Id = l.Id, Name = l.Name });
        }
    }
}
