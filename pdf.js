const jsPDF = window.jspdf.jsPDF;

/* =========================
   HELPERS
========================= */

const toNumber = value => {
    const n = parseFloat(value);
    return isNaN(n) ? 0 : n;
};

const getVal = id =>
    document.getElementById(id)?.value || "";

const formatMoney = value =>
    `$${value.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    })}`;

/* =========================
   PDF GENERATION
========================= */

function downloadPDF() {

    const pdf = new jsPDF({
        orientation: "portrait",
        unit: "pt",
        format: "letter"
    });

    /* =========================
       CONSTANTS
    ========================= */

    const PAGE_MARGIN = 50;
    const PAGE_HEIGHT = pdf.internal.pageSize.height;

    const COLORS = {
        blue: [0, 85, 222],
        black: [40, 40, 40],
        lightGray: [249, 249, 249]
    };

    const ROW_HEIGHT = 22;

    const SECTION = {
        leftX: 40,
        rightX: 312,
        width: 240
    };

    const TABLE = {
        startX: 40,
        width: 532
    };

    TABLE.col1 = TABLE.width * 0.55;
    TABLE.col2 = TABLE.width * 0.15;
    TABLE.col3 = TABLE.width * 0.15;
    TABLE.col4 = TABLE.width * 0.15;

    TABLE.x = {
        desc: TABLE.startX,
        qty: TABLE.startX + TABLE.col1,
        rate: TABLE.startX + TABLE.col1 + TABLE.col2,
        total: TABLE.startX + TABLE.col1 + TABLE.col2 + TABLE.col3
    };

    let y = PAGE_MARGIN;

    /* =========================
       DRAW HELPERS
    ========================= */

    const setBlackText = () =>
        pdf.setTextColor(...COLORS.black);

    const setWhiteText = () =>
        pdf.setTextColor(255, 255, 255);

    const pageBreak = () => {
        if (y + ROW_HEIGHT > PAGE_HEIGHT - PAGE_MARGIN) {
            pdf.addPage();
            y = PAGE_MARGIN;
        }
    };

    const drawFilledRect = (x, yy, w) => {
        pdf.rect(x, yy, w, ROW_HEIGHT, "F");
    };

    const drawRect = (x, yy, w) => {
        pdf.rect(x, yy, w, ROW_HEIGHT);
    };

    const drawSectionHeader = (x, yy, width, text) => {
        pdf.setFillColor(...COLORS.blue);
        pdf.rect(x, yy, width, ROW_HEIGHT, "F");

        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(10);

        setWhiteText();

        pdf.text(
            text,
            x + width / 2,
            yy + 15,
            { align: "center" }
        );

        setBlackText();
    };

    const drawRow = (x, yy, label, value) => {

        const LABEL_WIDTH = 70;
        const VALUE_WIDTH = 170;

        pdf.setFillColor(...COLORS.lightGray);

        pdf.rect(x, yy, LABEL_WIDTH, ROW_HEIGHT, "F");
        pdf.rect(x, yy, LABEL_WIDTH, ROW_HEIGHT);
        pdf.rect(
            x + LABEL_WIDTH,
            yy,
            VALUE_WIDTH,
            ROW_HEIGHT
        );

        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(9);
        pdf.text(label, x + 5, yy + 15);

        pdf.setFont("helvetica", "normal");
        pdf.text(
            value || "",
            x + LABEL_WIDTH + 5,
            yy + 15
        );
    };

    const drawTableBorders = yy => {
        drawRect(TABLE.x.desc, yy, TABLE.col1);
        drawRect(TABLE.x.qty, yy, TABLE.col2);
        drawRect(TABLE.x.rate, yy, TABLE.col3);
        drawRect(TABLE.x.total, yy, TABLE.col4);
    };

    /* =========================
       HEADER
    ========================= */

    pdf.setTextColor(...COLORS.blue);
    pdf.setFontSize(22);

    pdf.text(
        "Freelance CART Captioner and Interpreter",
        306,
        y,
        { align: "center" }
    );

    y += 28;

    pdf.setFontSize(12);

    pdf.text(
        "Service has been rendered",
        306,
        y,
        { align: "center" }
    );

    y += 30;

    setBlackText();

    /* =========================
       INFORMATION GRID
    ========================= */

    drawSectionHeader(
        SECTION.leftX,
        y,
        SECTION.width,
        "Communication Provider"
    );

    drawSectionHeader(
        SECTION.rightX,
        y,
        SECTION.width,
        "Assignment Information"
    );

    y += ROW_HEIGHT;

    drawRow(
        SECTION.leftX,
        y,
        "Invoice",
        getVal("invoiceNumber")
    );

    drawRow(
        SECTION.rightX,
        y,
        "Requestor",
        getVal("requestor")
    );

    y += ROW_HEIGHT;

    drawRow(
        SECTION.leftX,
        y,
        "Name",
        getVal("providerName")
    );

    drawRow(
        SECTION.rightX,
        y,
        "Request ID",
        getVal("requestId")
    );

    y += ROW_HEIGHT;

    drawRow(
        SECTION.leftX,
        y,
        "Address",
        getVal("address1")
    );

    drawRow(
        SECTION.rightX,
        y,
        "Docket",
        getVal("docket")
    );

    y += ROW_HEIGHT;

    drawRow(
        SECTION.leftX,
        y,
        "Address 2",
        getVal("address2")
    );

    drawRow(
        SECTION.rightX,
        y,
        "Service Date",
        getVal("serviceDate")
    );

    y += ROW_HEIGHT;

    drawRow(
        SECTION.leftX,
        y,
        "Email",
        getVal("email")
    );

    drawRow(
        SECTION.rightX,
        y,
        "Start Time",
        getVal("startTime")
    );

    y += ROW_HEIGHT;

    drawRow(
        SECTION.leftX,
        y,
        "Vendor Code",
        getVal("vendorCode")
    );

    drawRow(
        SECTION.rightX,
        y,
        "End Time",
        getVal("endTime")
    );

    y += 35;

    /* =========================
       TABLE HEADER
    ========================= */

    pdf.setFillColor(...COLORS.blue);
    setWhiteText();

    drawFilledRect(TABLE.x.desc, y, TABLE.col1);
    drawFilledRect(TABLE.x.qty, y, TABLE.col2);
    drawFilledRect(TABLE.x.rate, y, TABLE.col3);
    drawFilledRect(TABLE.x.total, y, TABLE.col4);

    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(10);

    pdf.text(
        "Description",
        TABLE.x.desc + TABLE.col1 / 2,
        y + 14,
        { align: "center" }
    );

    pdf.text(
        "Qty",
        TABLE.x.qty + TABLE.col2 / 2,
        y + 14,
        { align: "center" }
    );

    pdf.text(
        "Rate",
        TABLE.x.rate + TABLE.col3 / 2,
        y + 14,
        { align: "center" }
    );

    pdf.text(
        "Total",
        TABLE.x.total + TABLE.col4 / 2,
        y + 14,
        { align: "center" }
    );

    y += ROW_HEIGHT;

    /* =========================
       TABLE ROWS
    ========================= */

    setBlackText();
    pdf.setFont("helvetica", "normal");

    const getCell = (row, index) => {
        const cell = row.cells[index];
        if (!cell) return "";

        const input = cell.querySelector("input");
        return input
            ? input.value
            : cell.textContent.trim();
    };

    const getRowData = row => ({
        desc: getCell(row, 0),
        qty:
            row.querySelector(".qty")?.value ||
            row.querySelector(".miles")?.value ||
            "",
        rate:
            row.querySelector(".rate")?.value ||
            row.querySelector(".provider-rate")?.value ||
            "",
        total:
            row.querySelector(".total")?.value ||
            ""
    });

    let grand = 0;

    document
        .querySelectorAll("#invoiceBody tr")
        .forEach(row => {

            pageBreak();

            const data = getRowData(row);

            grand += toNumber(data.total);

            drawTableBorders(y);

            const desc = pdf.splitTextToSize(
                data.desc,
                TABLE.col1 - 10
            );

            pdf.text(
                desc,
                TABLE.x.desc + 5,
                y + 15
            );

            pdf.text(
                data.qty,
                TABLE.x.qty + TABLE.col2 - 5,
                y + 15,
                { align: "right" }
            );

            pdf.text(
                data.rate,
                TABLE.x.rate + TABLE.col3 - 5,
                y + 15,
                { align: "right" }
            );

            pdf.text(
                data.total,
                TABLE.x.total + TABLE.col4 - 5,
                y + 15,
                { align: "right" }
            );

            y += ROW_HEIGHT;
        });

    /* =========================
       GRAND TOTAL
    ========================= */

    pdf.rect(
        TABLE.startX,
        y,
        TABLE.col1 + TABLE.col2,
        ROW_HEIGHT
    );

    pdf.rect(
        TABLE.x.rate,
        y,
        TABLE.col3,
        ROW_HEIGHT
    );

    pdf.rect(
        TABLE.x.total,
        y,
        TABLE.col4,
        ROW_HEIGHT
    );

    pdf.setFont("helvetica", "bold");

    pdf.text(
        "Grand Total",
        TABLE.x.rate + 10,
        y + 15
    );

    pdf.text(
        formatMoney(grand),
        TABLE.x.total + TABLE.col4 - 5,
        y + 15,
        { align: "right" }
    );

    pdf.save("invoice.pdf");
}

/* =========================
   BUTTON
========================= */

document.addEventListener("DOMContentLoaded", () => {
    document
        .getElementById("downloadPdfBtn")
        ?.addEventListener("click", downloadPDF);
});