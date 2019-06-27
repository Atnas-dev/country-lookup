var CountryLookup = /** @class */ (function () {
    function CountryLookup(searchForm, target) {
        var _this = this;
        this.lastResult = [];
        this.searchForm = searchForm;
        this.target = target;
        this.resultsList = target.querySelector('ul');
        this.searchForm.addEventListener('submit', function (event) {
            event.preventDefault();
            _this.search(_this.formData)
                .then(function (results) {
                _this.printResults(results);
            });
        });
        this.target.querySelector('button.asc').addEventListener('click', function () {
            _this.printResults(_this.sortResults('asc'));
        });
        this.target.querySelector('button.desc').addEventListener('click', function () {
            _this.printResults(_this.sortResults('desc'));
        });
    }
    Object.defineProperty(CountryLookup.prototype, "formData", {
        get: function () {
            var categoryEl = this.searchForm.querySelector('[name="category"]');
            var searchEl = this.searchForm.querySelector('[name="search"]');
            return {
                category: categoryEl.value,
                search: searchEl.value,
            };
        },
        enumerable: true,
        configurable: true
    });
    CountryLookup.prototype.search = function (queries) {
        var _this = this;
        return fetch(CountryLookup.endpoint + "/" + queries.category + "/" + queries.search)
            .then(function (response) { return response.status === 200 ? response.json() : []; })
            .then(function (result) { return _this.lastResult = result; });
    };
    CountryLookup.prototype.printResults = function (data) {
        var _this = this;
        while (this.resultsList.firstChild) {
            this.resultsList.removeChild(this.resultsList.firstChild);
        }
        var template = document.getElementById('country-template');
        data.forEach(function (country) {
            var el = template.content.querySelector('li').cloneNode(true);
            el.setAttribute('data-name', country.name);
            _this.setCountryFlag(el, country)
                .setCountryName(el, country)
                .setCountryCapital(el, country)
                .setCountryPopulation(el, country)
                .setCountryLanguages(el, country)
                .setCountryCurrencies(el, country)
                .setCountryLink(el, country);
            _this.resultsList.appendChild(el);
        });
    };
    CountryLookup.prototype.setCountryFlag = function (element, country) {
        element.querySelector('img').setAttribute("src", country.flag);
        return this;
    };
    CountryLookup.prototype.setCountryName = function (el, country) {
        el.querySelector('h3').innerText = country.name;
        return this;
    };
    CountryLookup.prototype.setCountryCapital = function (el, country) {
        el.querySelector('.capital').innerText = country.capital;
        return this;
    };
    CountryLookup.prototype.setCountryPopulation = function (el, country) {
        el.querySelector('.population').innerText = country.population.toLocaleString('da');
        return this;
    };
    CountryLookup.prototype.setCountryLanguages = function (el, country) {
        var languages = country.languages.map(function (language) { return language.name; });
        el.querySelector('.language').innerText = languages.join(', ');
        return this;
    };
    CountryLookup.prototype.setCountryCurrencies = function (el, country) {
        var currencies = country.currencies.map(function (currency) { return (currency.code || '') + " (" + currency.symbol + ")"; });
        el.querySelector('.currency').innerText = currencies.join(', ');
        return this;
    };
    CountryLookup.prototype.setCountryLink = function (el, country) {
        el.querySelector('a').setAttribute('href', "http://maps.google.com/?ll=" + country.latlng[0] + "," + country.latlng[1]);
        return this;
    };
    CountryLookup.prototype.sortResults = function (direction) {
        var countries = {};
        this.lastResult.forEach(function (country) {
            countries[country.name] = country;
        });
        var countriesOordered = [];
        Object.keys(countries).sort().forEach(function (name) {
            countriesOordered.push(countries[name]);
        });
        if (direction === 'desc') {
            countriesOordered.reverse();
        }
        return countriesOordered;
    };
    // Country API base endpoint
    CountryLookup.endpoint = 'https://restcountries.eu/rest/v2';
    return CountryLookup;
}());
new CountryLookup(document.querySelector('form'), document.querySelector('.countries'));
//# sourceMappingURL=script.js.map