from utils import normalize_text, save_json, open_json, convert_zs_to_kw
import os, re

x = {
    "productId": "{4529AFB1-3600-48D9-9018-BEA5714F81E8}",
    "brand": "Amazone",
    "model": "Cirrus 4003",
    "yearOfManufacture": 2019,
    "catalogName": "agriculture",
    "categoryName": "agricombinationdrills",
    "meterReadout": null,
    "meterReadoutUnit": null,
    "locationCountryCode": "LV",
    "locationCity": "-",
    "priceEURO": 33000,
    "priceOriginal": 33000,
    "priceOriginalUnit": "EUR",
    "priceInUserCurrency": 33000,
    "userCurrency": "EUR",
    "imageUrl": "https://dnge9sb91helb.cloudfront.net/image/product/medium/4529afb1/amazone-cirrus-4003,1f6d15a2.jpg",
    "assetUrl": "/lauksaimnieciba/kombinetas-sejmasinas/amazone-cirrus-4003/grevm1nn.html",
    "companyUrl": "",
    "companyCountry": "",
    "imageCount": 10,
    "videoCount": 0,
    "companyName": "",
    "companyId": "",
    "featured": true,
    "highlighted": false,
    "latest24hAd": false,
    "rentalAd": false,
    "auctionAd": false,
    "favoriteAd": false,
    "createDate": "2025-01-09T08:32:37.44",
    "sellerPhone": "+371 20135525"
},

def build_from_listing(listing):
    return {
        "mark": listing["brand"],
        "model": listing["model"],
        "price": listing["priceEURO"],
        
    }