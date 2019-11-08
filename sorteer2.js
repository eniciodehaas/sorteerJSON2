// JSON importeren
let xmlhttp = new XMLHttpRequest();
xmlhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
        sorteerObject.data = JSON.parse(this.responseText);
        sorteerObject.voegJSdatumIn();
        sorteerObject.data.forEach( boek => {
            boek.titelHoofdletter = boek.titel.toUpperCase();
            boek.eersteAuteur = boek.auteur[0];
        });
        sorteerObject.sorteren();
    } 
}
xmlhttp.open('GET', "boeken.json", true);
xmlhttp.send();


const maakTabelKop = (arr) => {
    let kop = "<table class='boeken'><tr>";
    arr.forEach((item) => {
        kop += "<th class='boeken__kop'>" + item + "</th>";
    });
    kop += "</tr>";
    return kop;
}

// zet maand woord op in nummer
// waarbij januari 0 geeft
// en december 11
const geefMaandNummer = (maand) => {
    let nummer;
    switch (maand) {
        case "januari":       nummer = 0; break;
        case "februari":      nummer = 1; break;
        case "maart":         nummer = 2; break;
        case "april":         nummer = 3; break;
        case "mei":           nummer = 4; break;
        case "juni":          nummer = 5; break;
        case "juli":          nummer = 6; break;
        case "augustus":      nummer = 7; break;
        case "september":     nummer = 8; break;
        case "oktober":       nummer = 9; break;
        case "november":      nummer = 10; break;
        case "december":      nummer = 11; break;
        default:              nummer = 0;
    }
    return nummer;
}

// zet datum string op in datum-object
const maakDatum = (maandJaar) => {
    let mjArray = maandJaar.split(" ");
    let datum = new Date(mjArray[1], geefMaandNummer(mjArray[0]));
    return datum;
}


// functie maakt van een array een opsomming met ', ' en ' en '
const maakOpsomming = (array) => {
    let string = "";
    for (let i = 0; i < array.length; i++) {
        switch (i) {
            case array.length-1: string += array[i]; break;
            case array.length-2: string += array[i] + " en "; break;
            default: string += array[i] + ", "
        }
        
    }
    return string;
}


// maak functie die de text goed laat weergeven
const keerTekstOm = (string) => {
    if (string.indexOf(',') != -1) {
        let array = string.split(',');
        string = array[1] + ' ' + array[0];
    }
    return string;
}


// maak object dat de boeken uitvoert en sorteert en data bevat
// eigenschappen: data en sorteerkenmerk
// methods: sorteren() en uitvoeren()
let sorteerObject = {
    data: "",

    sorteerkenmerk: "titelHoofdletter",

    // sorteervolgorde
    sorteerVolgorde: 1,

    // datum object toevoegen aan data vanuit "uitgave"
    voegJSdatumIn: function() {
        this.data.forEach((item) => {
           item.jsDatum = maakDatum(item.uitgave);
        });
    },

    sorteren: function() {
        this.data.sort( (a,b) => a[this.sorteerkenmerk] > b[this.sorteerkenmerk] ? 1*this.sorteerVolgorde : -1*this.sorteerVolgorde );
        this.uitvoeren(this.data);
    },

    uitvoeren: function(data) {
        // uitvoer leegmaken
        document.getElementById('uitvoer').innerHTML = "";

        data.forEach( boek => {

            let boekSectie = document.createElement('section');
            boekSectie.className = 'boek';

            let main = document.createElement('main');
            main.className = 'boek__main';

            // afbeelding cover maken
            let cover = document.createElement('img');
            cover.className = 'boek__cover';
            cover.setAttribute('src', boek.cover);
            cover.setAttribute('alt', keerTekstOm(boek.titel));

            // titel van boek maken
            let boekTitel = document.createElement('h3');
            boekTitel.className = 'boek__titel';
            boekTitel.textContent = keerTekstOm(boek.titel);

            // prijs van boek maken
            let boekPrijs = document.createElement('div');
            boekPrijs.className = 'boek__prijs';
            boekPrijs.textContent = boek.prijs.toLocaleString('nl-NL', {currency: 'EUR', style: 'currency'});

            // auteurs van boek toevoegen
            let boekAuteurs = document.createElement('p')
            boekAuteurs.className = 'boek__auteur';
            boek.auteur[0] = keerTekstOm(boek.auteur[0]);
            boekAuteurs.textContent = maakOpsomming(boek.auteur);

            // overige informatie toevoegen
            let boekOverig = document.createElement('p');
            boekOverig.className = 'boek__overig';
            boekOverig.textContent = boek.uitgave + ' | ' + 'Bladzijden: ' + boek.paginas + ' | ' + boek.taal + ' | ' + 'Ean: ' + boek.ean;



            boekSectie.appendChild(cover);
            boekSectie.appendChild(main);
            main.appendChild(boekTitel);
            main.appendChild(boekAuteurs);
            main.appendChild(boekOverig);
            boekSectie.appendChild(boekPrijs);
            document.getElementById('uitvoer').appendChild(boekSectie);

        });
    }
}

// keuze sorteerkenmerk
document.getElementById('kenmerk').addEventListener('change', (e) => {
    sorteerObject.sorteerkenmerk = e.target.value;
    sorteerObject.sorteren();
})

document.getElementsByName('oplopend').forEach((item) => {
    item.addEventListener('click', (e) => {
        sorteerObject.sorteerVolgorde = parseInt(e.target.value);
        sorteerObject.sorteren();
    })
})