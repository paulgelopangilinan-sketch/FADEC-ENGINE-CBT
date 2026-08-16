/* =====================================================
   FADEC ENGINE CBT SIMULATOR
   AMT 107
   ===================================================== */


/* =====================================================
   SYSTEM VARIABLES
   ===================================================== */

let engineRunning = false;
let engineStarting = false;
let engineStopping = false;

let soundEnabled = true;

let startTimer = null;
let stopTimer = null;

let progressSeconds = 0;

const START_TIME = 23;
const STOP_TIME = 8;


/* =====================================================
   ENGINE PARAMETERS
   ===================================================== */

let engineData = {

    n1: 0,
    n2: 0,
    egt: 0,
    pressure: 0,
    fuelFlow: 0,
    airflow: 0

};


/* =====================================================
   ELEMENTS
   ===================================================== */

const startBtn =
    document.getElementById("startBtn");

const stopBtn =
    document.getElementById("stopBtn");

const resetBtn =
    document.getElementById("resetBtn");

const airVolume =
    document.getElementById("airVolume");

const airVolumeValue =
    document.getElementById("airVolumeValue");

const engineProgress =
    document.getElementById("engineProgress");

const progressAction =
    document.getElementById("progressAction");

const progressPercent =
    document.getElementById("progressPercent");

const progressFill =
    document.getElementById("progressFill");

const progressTime =
    document.getElementById("progressTime");

const engineStatus =
    document.getElementById("engineStatus");

const fadecStatus =
    document.getElementById("fadecStatus");

const statusBox =
    document.getElementById("statusBox");

const warningSign =
    document.getElementById("warningSign");

const warningTitle =
    document.getElementById("warningTitle");

const warningMessage =
    document.getElementById("warningMessage");

const airworthiness =
    document.getElementById("airworthiness");

const systemMessage =
    document.getElementById("systemMessage");

const faultLog =
    document.getElementById("faultLog");

const rightFaultLog =
    document.getElementById("rightFaultLog");

const faultCount =
    document.getElementById("faultCount");

const diagnosticResult =
    document.getElementById("diagnosticResult");

const rightDiagnostic =
    document.getElementById("rightDiagnostic");

const assessmentResult =
    document.getElementById("assessmentResult");

const soundStatus =
    document.getElementById("soundStatus");

const topEngineStatus =
    document.getElementById("topEngineStatus");

const topFadecStatus =
    document.getElementById("topFadecStatus");


/* =====================================================
   AUDIO
   ===================================================== */

const inputSound =
    document.getElementById("inputSound");

const cautionSound =
    document.getElementById("cautionSound");

const warningSound =
    document.getElementById("warningSound");

const startEngineSound =
    document.getElementById("startEngineSound");

const stopEngineSound =
    document.getElementById("stopEngineSound");


function playSound(audio) {

    if (!soundEnabled || !audio) {
        return;
    }

    try {

        audio.currentTime = 0;

        audio.play().catch(() => {});

    } catch (error) {

        console.log("Audio error:", error);

    }

}


function toggleSound() {

    soundEnabled = !soundEnabled;

    soundStatus.textContent =
        soundEnabled ? "ENABLED" : "MUTED";

    systemMessage.innerHTML =
        `<span class="message-light"></span>
         SOUND SYSTEM:
         ${soundEnabled ? "ENABLED" : "MUTED"}`;

    if (soundEnabled) {
        playSound(inputSound);
    }

}


/* =====================================================
   AIR VOLUME
   ===================================================== */

airVolume.addEventListener("input", function () {

    const value =
        Number(this.value);

    airVolumeValue.textContent =
        value;

    playSound(inputSound);

    updateEngine();

});


/* =====================================================
   ENGINE CALCULATION
   ===================================================== */

function calculateEngineParameters() {

    const air =
        Number(airVolume.value);


    if (!engineRunning) {

        engineData.n1 = 0;
        engineData.n2 = 0;
        engineData.egt = 0;
        engineData.pressure = 0;
        engineData.fuelFlow = 0;
        engineData.airflow = 0;

        return;

    }


    /*
       SIMULATED ENGINE PARAMETERS

       These are CBT simulation values.
    */

    engineData.n1 =
        30 + (air * 0.60);

    engineData.n2 =
        25 + (air * 0.50);

    engineData.egt =
        350 + (air * 5.5);

    engineData.pressure =
        20 + (air * 0.30);

    engineData.fuelFlow =
        500 + (air * 15);

    engineData.airflow =
        2 + (air * 0.08);


    engineData.n1 =
        Math.min(engineData.n1, 100);

    engineData.n2 =
        Math.min(engineData.n2, 100);

    engineData.egt =
        Math.min(engineData.egt, 1000);

}


/* =====================================================
   UPDATE ENGINE
   ===================================================== */

function updateEngine() {

    calculateEngineParameters();

    updateDisplays();

    evaluateSystem();

}


/* =====================================================
   UPDATE ALL DISPLAYS
   ===================================================== */

function updateDisplays() {

    const d =
        engineData;


    /* MCDU */

    document.getElementById("n1").textContent =
        d.n1.toFixed(1) + " %";

    document.getElementById("n2").textContent =
        d.n2.toFixed(1) + " %";

    document.getElementById("egt").textContent =
        Math.round(d.egt) + " °C";

    document.getElementById("pressure").textContent =
        d.pressure.toFixed(1) + " PSI";

    document.getElementById("fuelFlow").textContent =
        Math.round(d.fuelFlow) + " KG/H";

    document.getElementById("airflow").textContent =
        d.airflow.toFixed(2) + " KG/S";


    /* GAUGES */

    document.getElementById("gaugeN1").textContent =
        d.n1.toFixed(1);

    document.getElementById("gaugeN2").textContent =
        d.n2.toFixed(1);

    document.getElementById("gaugeEGT").textContent =
        Math.round(d.egt);

    document.getElementById("gaugePressure").textContent =
        d.pressure.toFixed(1);

    document.getElementById("gaugeFuel").textContent =
        Math.round(d.fuelFlow);

    document.getElementById("gaugeAirflow").textContent =
        d.airflow.toFixed(2);


    /* ENGINE STATUS */

    engineStatus.textContent =
        engineRunning ? "RUNNING" : "STOPPED";

    fadecStatus.textContent =
        engineRunning ? "ACTIVE" : "OFF";

    document.getElementById("screenFadec").textContent =
        engineRunning ? "ACTIVE" : "OFF";

    document.getElementById("screenEngine").textContent =
        engineRunning ? "RUNNING" : "STOPPED";

    document.getElementById("fadecPageStatus").textContent =
        engineRunning ? "ACTIVE" : "OFF";

    document.getElementById("sensorStatus").textContent =
        engineRunning ? "NORMAL" : "OFFLINE";

    document.getElementById("topFadecStatus").textContent =
        engineRunning ? "ACTIVE" : "OFF";

    topEngineStatus.textContent =
        engineRunning
            ? "ENGINE STATUS: RUNNING"
            : "ENGINE STATUS: STOPPED";


    /* GAUGE STATUS */

    updateGaugeStatus(
        "gaugeN1Status",
        d.n1,
        95
    );

    updateGaugeStatus(
        "gaugeN2Status",
        d.n2,
        90
    );

    updateGaugeStatus(
        "gaugeEGTStatus",
        d.egt,
        850
    );

    updateGaugeStatus(
        "gaugePressureStatus",
        d.pressure,
        48
    );

    updateGaugeStatus(
        "gaugeFuelStatus",
        d.fuelFlow,
        1800
    );

    updateGaugeStatus(
        "gaugeAirflowStatus",
        d.airflow,
        9
    );

}


/* =====================================================
   GAUGE STATUS
   ===================================================== */

function updateGaugeStatus(
    elementId,
    value,
    warningLimit
) {

    const element =
        document.getElementById(elementId);

    if (!element) {
        return;
    }


    if (!engineRunning) {

        element.textContent = "STOPPED";
        element.style.color = "#718084";

        return;

    }


    if (value >= warningLimit) {

        element.textContent = "WARNING";
        element.style.color = "#ff3030";

    }

    else if (value >= warningLimit * 0.9) {

        element.textContent = "CAUTION";
        element.style.color = "#ffd000";

    }

    else {

        element.textContent = "NORMAL";
        element.style.color = "#00ff66";

    }

}


/* =====================================================
   SYSTEM EVALUATION
   ===================================================== */

function evaluateSystem() {

    if (!engineRunning) {

        setNormalStatus(
            "SYSTEM NORMAL",
            "ENGINE STOPPED - SYSTEM READY"
        );

        airworthiness.textContent =
            "AIRWORTHY";

        airworthiness.className = "";

        return;

    }


    /*
       WARNING CONDITION

       EGT >= 850
       OR N1 >= 95
    */

    if (
        engineData.egt >= 850 ||
        engineData.n1 >= 95
    ) {

        setWarningStatus();

        return;

    }


    /*
       CAUTION CONDITION
    */

    if (
        engineData.egt >= 765 ||
        engineData.n1 >= 85
    ) {

        setCautionStatus();

        return;

    }


    setNormalStatus(
        "SYSTEM NORMAL",
        "ALL PARAMETERS WITHIN LIMITS"
    );

    airworthiness.textContent =
        "AIRWORTHY";

    airworthiness.className = "";

}


/* =====================================================
   NORMAL
   ===================================================== */

function setNormalStatus(
    title,
    message
) {

    statusBox.className =
        "status-display normal";

    statusBox.textContent =
        title;

    warningSign.className =
        "warning-display normal";

    warningTitle.textContent =
        "SYSTEM NORMAL";

    warningMessage.textContent =
        message;

}


/* =====================================================
   CAUTION
   ===================================================== */

function setCautionStatus() {

    statusBox.className =
        "status-display caution";

    statusBox.textContent =
        "CAUTION";

    warningSign.className =
        "warning-display caution";

    warningTitle.textContent =
        "CAUTION";

    warningMessage.textContent =
        "ENGINE PARAMETER APPROACHING LIMIT";


    airworthiness.textContent =
        "REQUIRES MONITORING";

    airworthiness.className =
        "maintenance";


    playSound(cautionSound);

}


/* =====================================================
   WARNING
   ===================================================== */

function setWarningStatus() {

    statusBox.className =
        "status-display warning";

    statusBox.textContent =
        "WARNING";

    warningSign.className =
        "warning-display warning";

    warningTitle.textContent =
        "WARNING";

    if (engineData.egt >= 850) {

        warningMessage.textContent =
            "EGT EXCEEDS LIMIT";

    }

    else {

        warningMessage.textContent =
            "N1 EXCEEDS LIMIT";

    }


    airworthiness.textContent =
        "REQUIRES MAINTENANCE";

    airworthiness.className =
        "maintenance";


    addFault(
        engineData.egt >= 850
            ? "EGT EXCEEDS LIMIT"
            : "N1 EXCEEDS LIMIT"
    );

    playSound(warningSound);

}


/* =====================================================
   START ENGINE
   23 SECONDS
   ===================================================== */

startBtn.addEventListener(
    "click",
    startEngine
);


function startEngine() {

    if (
        engineRunning ||
        engineStarting ||
        engineStopping
    ) {

        return;

    }


    engineStarting = true;

    progressSeconds = 0;

    clearInterval(startTimer);
    clearInterval(stopTimer);


    engineProgress.classList.remove("hidden");

    progressAction.textContent =
        "ENGINE STARTING";

    progressPercent.textContent =
        "0%";

    progressFill.style.width =
        "0%";

    progressTime.textContent =
        "0 / 23 seconds";


    startBtn.disabled = true;

    stopBtn.disabled = true;


    systemMessage.innerHTML =
        `<span class="message-light"></span>
         ENGINE START SEQUENCE INITIATED`;


    playSound(startEngineSound);


    startTimer =
        setInterval(function () {

            progressSeconds++;

            const percent =
                Math.round(
                    (progressSeconds / START_TIME) * 100
                );


            progressFill.style.width =
                percent + "%";

            progressPercent.textContent =
                percent + "%";

            progressTime.textContent =
                progressSeconds +
                " / " +
                START_TIME +
                " seconds";


            if (
                progressSeconds >= START_TIME
            ) {

                clearInterval(startTimer);

                finishEngineStart();

            }

        }, 1000);

}


/* =====================================================
   FINISH START
   ===================================================== */

function finishEngineStart() {

    engineStarting = false;

    engineRunning = true;


    engineProgress.classList.add("hidden");


    startBtn.disabled = false;

    stopBtn.disabled = false;


    systemMessage.innerHTML =
        `<span class="message-light"></span>
         ENGINE STARTED - FADEC ACTIVE`;


    updateEngine();

}


/* =====================================================
   STOP ENGINE
   8 SECONDS
   ===================================================== */

stopBtn.addEventListener(
    "click",
    stopEngine
);


function stopEngine() {

    if (
        !engineRunning ||
        engineStopping ||
        engineStarting
    ) {

        return;

    }


    engineStopping = true;

    progressSeconds = 0;


    clearInterval(startTimer);
    clearInterval(stopTimer);


    engineProgress.classList.remove("hidden");

    progressAction.textContent =
        "ENGINE STOPPING";

    progressPercent.textContent =
        "0%";

    progressFill.style.width =
        "0%";

    progressFill.style.background =
        "#ff3030";

    progressTime.textContent =
        "0 / 8 seconds";


    startBtn.disabled = true;

    stopBtn.disabled = true;


    systemMessage.innerHTML =
        `<span class="message-light"></span>
         ENGINE SHUTDOWN SEQUENCE INITIATED`;


    playSound(stopEngineSound);


    stopTimer =
        setInterval(function () {

            progressSeconds++;

            const percent =
                Math.round(
                    (progressSeconds / STOP_TIME) * 100
                );


            progressFill.style.width =
                percent + "%";

            progressPercent.textContent =
                percent + "%";

            progressTime.textContent =
                progressSeconds +
                " / " +
                STOP_TIME +
                " seconds";


            if (
                progressSeconds >= STOP_TIME
            ) {

                clearInterval(stopTimer);

                finishEngineStop();

            }

        }, 1000);

}


/* =====================================================
   FINISH STOP
   ===================================================== */

function finishEngineStop() {

    engineStopping = false;

    engineRunning = false;


    engineProgress.classList.add("hidden");


    progressFill.style.background =
        "#00ff66";


    startBtn.disabled = false;

    stopBtn.disabled = false;


    systemMessage.innerHTML =
        `<span class="message-light"></span>
         ENGINE STOPPED - SYSTEM READY`;


    updateEngine();

}


/* =====================================================
   RESET / RETEST
   ===================================================== */

resetBtn.addEventListener(
    "click",
    resetSystem
);


function resetSystem() {

    clearInterval(startTimer);
    clearInterval(stopTimer);


    engineRunning = false;

    engineStarting = false;

    engineStopping = false;


    progressSeconds = 0;


    engineData = {

        n1: 0,
        n2: 0,
        egt: 0,
        pressure: 0,
        fuelFlow: 0,
        airflow: 0

    };


    /* AIR VOLUME RESET = 50% */

    airVolume.value = 50;

    airVolumeValue.textContent = "50";


    engineProgress.classList.add("hidden");

    progressFill.style.width = "0%";

    progressFill.style.background =
        "#00ff66";


    startBtn.disabled = false;

    stopBtn.disabled = false;


    faultLog.innerHTML =
        "NO FAULTS RECORDED";

    rightFaultLog.innerHTML =
        "NO ACTIVE FAULTS";

    faultCount.textContent =
        "0 / LOG";


    diagnosticResult.textContent =
        "READY";

    rightDiagnostic.textContent =
        "READY";


    assessmentResult.innerHTML =
        "";


    systemMessage.innerHTML =
        `<span class="message-light"></span>
         SYSTEM RESET - READY FOR RETEST`;


    updateEngine();

}


/* =====================================================
   MCDU PAGE CONTROL
   ===================================================== */

function showPage(page) {

    const pages = [
        "enginePage",
        "fadecPage",
        "faultPage",
        "diagnosticPage"
    ];


    pages.forEach(function (pageId) {

        const element =
            document.getElementById(pageId);

        if (element) {

            element.classList.add("hidden");

        }

    });


    const selected =
        document.getElementById(
            page + "Page"
        );


    if (selected) {

        selected.classList.remove("hidden");

    }


    playSound(inputSound);

}


/* =====================================================
   FAULT LOG
   ===================================================== */

let faults = [];


function addFault(message) {

    if (faults.includes(message)) {

        return;

    }


    faults.push(message);


    faultLog.innerHTML =
        faults.map(function (fault, index) {

            return `
                <div>
                    ${String(index + 1).padStart(3, "0")}
                    &nbsp;
                    ${fault}
                </div>
            `;

        }).join("");


    rightFaultLog.innerHTML =
        faults.map(function (fault) {

            return `
                <div>
                    <span style="color:#ff3030;">
                        ${fault}
                    </span>
                </div>
            `;

        }).join("");


    faultCount.textContent =
        faults.length + " / LOG";


    document.getElementById(
        "faultStatus"
    ).textContent =
        faults.length > 0
            ? "FAULT PRESENT"
            : "NONE";

}


/* =====================================================
   ACKNOWLEDGE WARNING
   ===================================================== */

function acknowledgeWarning() {

    systemMessage.innerHTML =
        `<span class="message-light"></span>
         WARNING ACKNOWLEDGED`;


    playSound(inputSound);

}


/* =====================================================
   DIAGNOSTIC
   ===================================================== */

function runDiagnostic() {

    diagnosticResult.textContent =
        "RUNNING DIAGNOSTIC...";

    rightDiagnostic.textContent =
        "RUNNING DIAGNOSTIC...";


    systemMessage.innerHTML =
        `<span class="message-light"></span>
         DIAGNOSTIC TEST IN PROGRESS`;


    setTimeout(function () {

        let result;


        if (!engineRunning) {

            result =
                "ENGINE OFF - START ENGINE FOR FULL TEST";

        }

        else if (
            engineData.egt >= 850 ||
            engineData.n1 >= 95
        ) {

            result =
                "FAULT DETECTED - REQUIRES MAINTENANCE";

        }

        else if (
            engineData.egt >= 765 ||
            engineData.n1 >= 85
        ) {

            result =
                "CAUTION - PARAMETERS REQUIRE MONITORING";

        }

        else {

            result =
                "SYSTEM NORMAL - NO FAULTS DETECTED";

        }


        diagnosticResult.textContent =
            result;

        rightDiagnostic.textContent =
            result;


        systemMessage.innerHTML =
            `<span class="message-light"></span>
             DIAGNOSTIC COMPLETE`;


    }, 1500);

}


/* =====================================================
   CBT ASSESSMENT
   ===================================================== */

function startAssessment() {

    assessmentResult.innerHTML = `
        <strong>ASSESSMENT ACTIVE</strong><br><br>

        1. Start the engine using START ENGINE.<br>
        2. Adjust the AIR VOLUME INPUT.<br>
        3. Observe N1, N2, EGT, pressure,
        fuel flow and airflow.<br>
        4. Identify NORMAL, CAUTION and WARNING
        conditions.<br>
        5. Run the diagnostic test.
    `;


    showPage("engine");


    systemMessage.innerHTML =
        `<span class="message-light"></span>
         CBT ASSESSMENT STARTED`;

}


/* =====================================================
   HOME
   ===================================================== */

function goHome() {

    showPage("engine");

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });


    systemMessage.innerHTML =
        `<span class="message-light"></span>
         HOME - ENGINE CONTROL PAGE`;

}


/* =====================================================
   HELP
   ===================================================== */

function showHelp() {

    alert(
        "FADEC ENGINE CBT SIMULATOR\n\n" +

        "1. Click START ENGINE.\n" +
        "2. Wait for the 23-second start sequence.\n" +
        "3. Adjust the air-volume slider.\n" +
        "4. Monitor engine parameters.\n" +
        "5. Check warnings and cautions.\n" +
        "6. Run diagnostics.\n" +
        "7. Use STOP ENGINE for the 8-second shutdown sequence."
    );

}


/* =====================================================
   EXIT
   ===================================================== */

function exitSimulator() {

    const confirmed =
        confirm(
            "Exit the FADEC Engine CBT Simulator?"
        );


    if (confirmed) {

        systemMessage.innerHTML =
            `<span class="message-light"></span>
             SIMULATOR EXIT REQUESTED`;

    }

}


/* =====================================================
   INITIALIZE
   ===================================================== */

function initializeSimulator() {

    /* STARTING AIR VOLUME = 50% */

    airVolume.value = 50;

    airVolumeValue.textContent = "50";


    updateEngine();


    systemMessage.innerHTML =
        `<span class="message-light"></span>
         SYSTEM READY - CBT AVAILABLE`;

}


/* =====================================================
   START
   ===================================================== */

initializeSimulator();