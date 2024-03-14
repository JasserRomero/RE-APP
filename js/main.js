/*
    Autor: Jasser Romero
    Cc: 100199640

    Tipo de formato = tipo;fecha;identificador;fatalidades
*/

const TITLE = "IMPORTANTE"
const TEMPLATE = 
`
<section class="section-instrucciones">
<h4>Introducción.</h4><br/>
<p>RE-APP es una aplicación web que te permite explorar y analizar datos de accidentes contenidos en archivos de texto. Con una interfaz intuitiva y accesible, RE-APP te ayuda a comprender mejor la información sobre accidentes de tráfico y ofrece estadísticas clave para un análisis detallado.</p><br/>
<strong>Indicaciones.<br/></strong>
<p>Se debe cargar un archivo .txt que contenga la información a analizar en la siguiente ruta.</p><br/>
<ul class="ol-rules">
    <li><strong>Ubicacion:</strong> ./{raiz-proyecto}/data/data.txt</li>
</ul>
<p>Posterior a esto, presionar en el botón "Procesar Archivo". Esto generará una estadística con la siguiente información: </p>
<ol class="ol-rules">
    <li>Cantidad de accidentes vehiculares</li>
    <li>Cantidad de accidentes con víctimas fatales</li>
    <li>Cantidad de fatalidades en general</li>
    <li>Promedio de fatalidades</li>
</ol>
</section>
`

document.addEventListener("DOMContentLoaded", () => {
    // EXPRESIONES
    const fileExtension = /\.(txt)$/i; // Determina el tipo de archivo a procesar
    const lastinput = /;(\d+)$/; // Del formato de entrada, obtiene las fatalidades
    const type = 'v';
    const date = '(19\\d{2}|20[0-1]\\d|202[0-4])-(((0(1|3|5|8)|1(0|2))-(0[1-9]|[12]\\d|3[0-1]))|(0(4|6|9)|11)-(0[1-9]|[12]\\d|30)|(02)-([12]\\d|0[1-9]))';
    const vehicleplates = '((([a-zA-Z]{3})[-\\s]?((\\d{3})|(\\d{2}[a-zA-Z]{1}))|((a{2}|d{2}|c{2}|m{2}|o{2})[-\\s]?\\d{4})|((s|r){1}[-\\s]?\\d{5})),?)+';
    const fatalities = '\\d{1,2}';
    const format = new RegExp('^' + type + ';' + date + ';' + vehicleplates + ';' + fatalities + '$', 'i');
    console.log(format)

    // Cargues adicionales
    CreateToast("#content-toast");
    CreateModal("#content-modal");

    //Variables
    const INPUT = document.querySelector("#datafile");
    const BUTTON = document.querySelector("#processData");
    const PREELEMENT = document.querySelector("#datafilepre");
    const BUTTON_CLOSE_MODAL = document.querySelector(".modal-close")

    // Eventos
    BUTTON.addEventListener("click", processFile);
    INPUT.addEventListener("change", changePre)
    BUTTON_CLOSE_MODAL.addEventListener("click", closeModal)
    
    setTimeout(() => showModal(TITLE, TEMPLATE), 800);

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
        let fatalitiesCount = 0;

        for (let i = 0; i < lines.length; i++) {
            const currentLine = lines[i].trim();

            if(!/\S/.test(currentLine)) continue
            const isValidLineFormat = format.test(currentLine);

            if (isValidLineFormat) {
                vehiclesAccidentsCount++

                let fatalities = lastinput.exec(currentLine).at(1)
                if (fatalities > 0) {
                    fatalitiesCount += +fatalities;
                    vehiclesAccidentsFatalitiesCount++;
                }
            }            
        }

        const average = (fatalitiesCount / vehiclesAccidentsFatalitiesCount).toFixed(2)

        const TEMPLATE = 
        `
        <p>Cantidad de accidentes vehiculares: <strong>${vehiclesAccidentsCount}</strong></p>
        <p>Cantidad de accidentes con victimas fatales: <strong>${vehiclesAccidentsFatalitiesCount}</strong></p>
        <p>Cantidad de fatalidades en general: <strong>${fatalitiesCount}</strong></p>
        <p>Promedio de fatalidades: <strong>${average}</strong></p>
        `
        showModal("RESULTADO", TEMPLATE)
    }
    function changePre() {
        const filename = INPUT.value
        PREELEMENT.innerHTML = "Archivo a procesar " + filename 
    }
});