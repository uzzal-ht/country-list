"use strict"

const apiUrl = "https://restcountries.com/v2/all";

const form = document.getElementById('isoCodesForm');
const resultField = document.querySelector('.result-field');
const countryListRow = document.querySelector('.country-list-row');
const displayInner = document.querySelector(".country-list-inner")

const html = (item) => {
    return `
    <tr>
        <td>${item.isoCode}</td>
        <td> <span>
            <img src="${item.flag}" alt="${item.name}" class="flag">
        </span> ${item.name} ${item.count > 1 ? '(' + item.count + ')' : ''} </td>
        <td>${item.capital}</td>
    </tr>
    `
}

const fetchCountry = async (isoCodeList) => {
    const response = await fetch(apiUrl);
    const data = await response.json();

    const isoCodeCounts = {};

    isoCodeList.forEach(isoCode => {
        isoCodeCounts[isoCode] = (isoCodeCounts[isoCode] || 0) + 1;
    });

    const countryArray = [];

    data.forEach(item => {
        if (item.alpha2Code && isoCodeCounts[item.alpha2Code]) {
            const isoCode = item.alpha2Code;
            countryArray.push({
                isoCode: isoCode,
                name: item.name,
                flag: item.flags.png,
                count: isoCodeCounts[isoCode],
                capital: item.capital
            });
        }
    });

    let itemMarkup = ""
    countryArray.forEach(item => {
        itemMarkup += html(item)
    })

    displayInner.style.display = "block";
    countryListRow.innerHTML = itemMarkup;
}

form.addEventListener("submit", function(event) {
    event.preventDefault();
 
    const formData = new FormData(form);
    const alphaValue = formData.get('alpha');

    const isoCodeList = alphaValue.split("\n").map(el => el.trim().toUpperCase()).filter(Boolean)

    fetchCountry(isoCodeList)
});