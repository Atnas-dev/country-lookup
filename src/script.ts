type FormData = {
    category: string,
    search: string|number,
};


class CountryLookup {
    // Country API base endpoint
    static readonly endpoint = 'https://restcountries.eu/rest/v2';

    // Search form must contain 2 inputs/select tags
    // One with name="category", one with name="search"
    private readonly searchForm: HTMLFormElement;
    private readonly target: HTMLElement;
    private readonly resultsList: HTMLUListElement;

    private lastResult: Country[] = [];


    constructor(searchForm: HTMLFormElement, target: HTMLElement) {
        this.searchForm = searchForm;
        this.target = target;
        this.resultsList = target.querySelector('ul');


        this.searchForm.addEventListener('submit', (event) => {
            event.preventDefault();

            this.search(this.formData)
                .then((results) => {
                    this.printResults(results);
                });
        });

        this.target.querySelector('button.asc').addEventListener('click', () => {
            this.printResults(this.sortResults('asc'));
        });

        this.target.querySelector('button.desc').addEventListener('click', () => {
            this.printResults(this.sortResults('desc'));
        });
    }


    private get formData(): FormData {
        const categoryEl = this.searchForm.querySelector('[name="category"]') as HTMLInputElement|HTMLSelectElement;
        const searchEl = this.searchForm.querySelector('[name="search"]') as HTMLInputElement|HTMLSelectElement;

        return {
            category: categoryEl.value,
            search: searchEl.value,
        };
    }


    private search(queries: FormData): Promise<Country[]> {
        return fetch(`${CountryLookup.endpoint}/${queries.category}/${queries.search}`)
            .then((response) => response.status === 200 ? response.json() : [])
            .then((result: Country[]) => this.lastResult = result);
    }


    private printResults(data: Country[]) {
        while (this.resultsList.firstChild) {
            this.resultsList.removeChild(this.resultsList.firstChild);
        }

        const template = document.getElementById('country-template') as HTMLTemplateElement;

        data.forEach((country) => {
            const el = template.content.querySelector('li').cloneNode(true) as HTMLLIElement;
            el.setAttribute('data-name', country.name);

            this.setCountryFlag(el, country)
                .setCountryName(el, country)
                .setCountryCapital(el, country)
                .setCountryPopulation(el, country)
                .setCountryLanguages(el, country)
                .setCountryCurrencies(el, country)
                .setCountryLink(el, country);

            this.resultsList.appendChild(el);
        });
    }


    private setCountryFlag(element: HTMLLIElement, country: Country): CountryLookup {
        element.querySelector('img').setAttribute("src", country.flag);

        return this
    }


    private setCountryName(el: HTMLLIElement, country: Country): CountryLookup {
        el.querySelector('h3').innerText = country.name;

        return this;
    }


    private setCountryCapital(el: HTMLLIElement, country: Country): CountryLookup {
        (el.querySelector('.capital') as HTMLElement).innerText = country.capital;

        return this;
    }


    private setCountryPopulation(el: HTMLLIElement, country: Country): CountryLookup {
        (el.querySelector('.population') as HTMLElement).innerText = country.population.toLocaleString('da');

        return this;
    }


    private setCountryLanguages(el: HTMLLIElement, country: Country): CountryLookup {
        const languages = country.languages.map((language) => language.name);
        (el.querySelector('.language') as HTMLElement).innerText = languages.join(', ');

        return this;
    }


    private setCountryCurrencies(el: HTMLLIElement, country: Country): CountryLookup {
        let currencies = country.currencies.map((currency) => `${currency.code || ''} (${currency.symbol})`);
        (el.querySelector('.currency') as HTMLElement).innerText = currencies.join(', ');

        return this;
    }


    private setCountryLink(el: HTMLLIElement, country: Country): CountryLookup {
        el.querySelector('a').setAttribute('href', `http://maps.google.com/?ll=${country.latlng[0]},${country.latlng[1]}`);

        return this;
    }


    private sortResults(direction: 'asc'|'desc'): Country[] {
        const countries = {};

        this.lastResult.forEach((country) => {
            countries[country.name] = country;
        });

        const countriesOordered = [];
        Object.keys(countries).sort().forEach((name) => {
            countriesOordered.push(countries[name]);
        });

        if (direction === 'desc') {
            countriesOordered.reverse();
        }

        return countriesOordered;
    }
}


new CountryLookup(document.querySelector('form'), document.querySelector('.countries'));



type alpha2code = string; // length 2
type alpha3code = string; // length 3

type currency = {
    "code": string,
    "name": string,
    "symbol": string,
}
type language = {
    "iso639_1": string,
    "iso639_2": string,
    "name": string,
    "nativeName": string
}

type regionalBloc = {
    "acronym": string,
    "name": string,
    "otherAcronyms": [],
    "otherNames": string[]
}


export type Country = {
    "name": string,
    "topLevelDomain": string[],
    "alpha2Code": alpha2code,
    "alpha3Code": alpha3code,
    "callingCodes": string[], // numbers as strings
    "capital": string,
    "altSpellings": string[],
    "region": string,
    "subregion": string,
    "population": number,
    "latlng": [number, number],
    "demonym": string,
    "area": number,
    "gini": number,
    "timezones": string,
    "borders": alpha3code[],
    "nativeName": string,
    "numericCode": string, // number as string,
    "currencies": currency[],
    "languages": language[],
    "translations": {[key: string]: string}, // key is alpha2code
    "flag": string, // url
    "regionalBlocs": regionalBloc[],
    "cioc": string
}
