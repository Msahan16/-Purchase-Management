using Microsoft.AspNetCore.Mvc;
using PurchaseManagement.Api.Services;

namespace PurchaseManagement.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ItemsController : ControllerBase
    {
        private readonly IMasterDataService _service;

        public ItemsController(IMasterDataService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<IActionResult> GetItems()
        {
            return Ok(await _service.GetItemsAsync());
        }
    }

    [ApiController]
    [Route("api/[controller]")]
    public class LocationsController : ControllerBase
    {
        private readonly IMasterDataService _service;

        public LocationsController(IMasterDataService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<IActionResult> GetLocations()
        {
            return Ok(await _service.GetLocationsAsync());
        }
    }
}
