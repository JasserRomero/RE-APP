document.addEventListener("DOMContentLoaded", () => {
    // EXPRESIONES
    const fileExtension = /\.(txt)$/i;
    const type = 'v';
    const date = '(19\\d{2}|20[0-1]\\d|202[0-4])-(0?[1-9]|1[0-2])-([12]\\d|3[01]|0?[1-9])';
    const vehicleplates = '(([a-zA-Z]{2,3})[-\\s]?((\\d{3})|(\\d{2}[a-zA-Z]{1})),?)+';
    const fatalities = '\\d{1,2}';
    const format = new RegExp('^' + type + ';' + date + ';' + vehicleplates + ';' + fatalities + '$');

    // Cargues adicionales
    CreateToast("#content-toast")

    //Variables
    const INPUT = document.querySelector("#datafile");
    const BUTTON = document.querySelector("#processData");
    const PREELEMENT = document.querySelector("#datafilepre");

    // Eventos
    BUTTON.addEventListener("click", processFile);
    INPUT.addEventListener("change", changePre)

    // Funciones
    function processFile() { 
        if (!INPUT.files.length) {
            showAlert("Por favor, seleccione un archivo")
            return;
        }
        
        const namefile = INPUT.value
        if (!fileExtension.test(namefile)) {
            showAlert("Por favor, selecciona un archivo con extensión .txt");
            INPUT.value = '';
            PREELEMENT.innerHTML = '';
            return;
        }

        const file = INPUT.files[0];
        const reader = new FileReader();

        reader.onload = function (e) {
            const fileContent = e.target.result;
            proccesData(fileContent);
        };

        reader.readAsText(file);
    }
    function proccesData(content) {
        const lines = content.split('\n');

        let vehiclesAccidentsCount = 0;
        let vehiclesAccidentsFatalitiesCount = 0;

        for (let i = 0; i < lines.length; i++) {
            const currentLine = lines[i].trim();

            if(!/\S/.test(currentLine)) continue
            const isValidLineFormat = format.test(currentLine);

            if (isValidLineFormat) {
                vehiclesAccidentsCount++

                if (currentLine.split(";").at(-1) > 0) {
                    vehiclesAccidentsFatalitiesCount++;
                }

            }            
        }

        console.log({
            accidentesVehiculares: vehiclesAccidentsCount,
            accidentesConVictimasFatales: vehiclesAccidentsFatalitiesCount
        })
    }
    function changePre() {
        const filename = INPUT.value
        PREELEMENT.innerHTML = "Archivo a procesar " + filename 
    }
});