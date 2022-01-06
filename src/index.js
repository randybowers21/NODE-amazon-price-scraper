const axios = require('axios');
const {JSDOM} = require('jsdom');


const getProductUrl = (product_id) => {
    return `https://www.amazon.com/gp/product/ajax/?asin=${product_id}&m=&qid=&smid=&sourcecustomerorglistid=&sourcecustomerorglistitemid=&sr=&pc=dp&experienceId=aodAjaxMain`
}

async function getPrices(product_id) {
    const productUrl = getProductUrl(product_id);
    const {data} = await axios.get(productUrl, {
        headers : {
            Accept: 'text/html,*/*',
            Host: 'www.amazon.com',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36',
            pragma: 'no-cache',
            'Upgrade-Insecure-Requests': 1,
        }
    });

    const dom = new JSDOM(data);
    const getElement = (selector) => {
        return dom.window.document.querySelector(selector)
    }

    const pinnedElement = getElement('#pinned-de-id');

    const getOffer = (element) => {
        const ships_from = element.querySelector('#aod-offer-shipsFrom .a-col-right .a-size-small').textContent.trim();
        const sold_by = element.querySelector('#aod-offer-soldBy .a-col-right .a-size-small').textContent.trim();
        const price = element.querySelector('.a-price .a-offscreen').textContent;
        return {
            ships_from,
            sold_by,
            price
        }
    }

    const title = getElement('#aod-asin-title-text').textContent;
 
    const offerListElement = getElement('#aod-offer-list');
    const offerElements = offerListElement.querySelectorAll('#aod-offer');
    const offers = [];

    offerElements.forEach((offerElement) =>{
        offers.push(getOffer(offerElement))
    })

    const result = {
        title,
        pinned: getOffer(pinnedElement),
        offers
    }
    console.log(result)
}

getPrices("B081H43WV2")