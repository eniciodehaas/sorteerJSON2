// JSON importeren
let xmlhttp = new XMLHttpRequest();
xmlhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
        sorteerObject.data = JSON.parse(this.responseText);
        sorteerObject.voegJSdatumIn();
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

const maakTabelRij = (arr, accent) => {
    let rij = ""
    if(accent == true) {
        rij = "<tr class='boeken__rij--accent'>";
    } else {
        rij = "<tr class='boeken__rij'>"
    }
    arr.forEach((item) => {
        rij += "<td class='boeken__cel'>" + item + "</td>";
    });
    rij += "</tr>";
    return rij;
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



// maak object dat de boeken uitvoert en sorteert en data bevat
// eigenschappen: data en sorteerkenmerk
// methods: sorteren() en uitvoeren()
let sorteerObject = {
    data: "",

    sorteerkenmerk: "titel",

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
        let uitvoer = maakTabelKop(
            ["titel", 
            "auteur(s)", 
            "cover", 
            "uitgave", 
            "bladzijdes", 
            "taal", 
            "EAN",
            "uitgever",
            "prijs"]);
        for (let i = 0; i < data.length; i++) {
            let accent = false;
            i % 2 == 0 ? accent = true : accent = false;
            let imgElement = 
            "<img src='" +
             data[i].cover + 
            "' class='boeken__cover' alt='" + 
            data[i].titel + 
            "'>";
            // maak opsomming van auteurs
            let auteurs = maakOpsomming(data[i].auteur);
            uitvoer += maakTabelRij(
                [data[i].titel, 
                auteurs, 
                imgElement, 
                data[i].uitgave, 
                data[i].paginas, 
                data[i].taal, 
                data[i].ean,
                data[i].uitgever,
                data[i].prijs], accent,
                );
        }
        document.getElementById('uitvoer').innerHTML = uitvoer;
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