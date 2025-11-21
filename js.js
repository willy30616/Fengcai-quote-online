
    const itemsTableBody = document.querySelector("#itemsTable tbody");
    const subTotalSpan = document.getElementById("subTotal");
    const taxAmountSpan = document.getElementById("taxAmount");
    const grandTotalSpan = document.getElementById("grandTotal");
    const feedback = document.getElementById("feedback");

    let itemIndex = 0;
    let projectNameEdited = false;


    // 💡 如果你要全國完整資料：
    // 1. 從「全國路名資料」下載 CSV
    // 2. 寫一個小工具把 city / site_id / road 轉成上面 taiwanData 的結構
    // 3. 替換掉這個 taiwanData 物件即可
    // （考量回答長度，我沒辦法在這裡幫你把幾萬筆路名全部打進來）

    // 初始化報價日期（今天）& 報價單號（yymmdd）
function initQuoteDateAndNumber() {
    const today = new Date();
    const yyyy = today.getFullYear();
    const yy = String(yyyy).slice(2);
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");
    document.getElementById("quoteDate").value = `${yyyy}-${mm}-${dd}`;
    document.getElementById("quoteNumber").value = `${yy}${mm}${dd}`;
}

    // ========= 地址下拉初始化 =========
function initAddressSelectors(prefix) {
    const citySel = document.getElementById(prefix + "City");
    const distSel = document.getElementById(prefix + "District");
    const roadSel = document.getElementById(prefix + "Road");

    citySel.innerHTML = "";
    const optCityEmpty = document.createElement("option");
    optCityEmpty.value = "";
    optCityEmpty.textContent = "縣市";
    citySel.appendChild(optCityEmpty);

    Object.keys(taiwanData).forEach(city => {
    const opt = document.createElement("option");
    opt.value = city;
    opt.textContent = city;
    citySel.appendChild(opt);
    });

    citySel.addEventListener("change", () => {
        const city = citySel.value;
        distSel.innerHTML = "";
        roadSel.innerHTML = "";
        const optDistEmpty = document.createElement("option");
        optDistEmpty.value = "";
        optDistEmpty.textContent = "區域";
        distSel.appendChild(optDistEmpty);

        const optRoadEmpty = document.createElement("option");
        optRoadEmpty.value = "";
        optRoadEmpty.textContent = "路名";
        roadSel.appendChild(optRoadEmpty);

        if (city && taiwanData[city]) {
        Object.keys(taiwanData[city]).forEach(dist => {
        const opt = document.createElement("option");
        opt.value = dist;
        opt.textContent = dist;
        distSel.appendChild(opt);
        });
        }

        if (prefix === "site") updateProjectNameAuto();
    });

    distSel.addEventListener("change", () => {
        const city = citySel.value;
        const dist = distSel.value;
        roadSel.innerHTML = "";
        const optRoadEmpty = document.createElement("option");
        optRoadEmpty.value = "";
        optRoadEmpty.textContent = "路名";
        roadSel.appendChild(optRoadEmpty);

        if (city && dist && taiwanData[city] && taiwanData[city][dist]) {
        taiwanData[city][dist].forEach(road => {
            const opt = document.createElement("option");
            opt.value = road;
            opt.textContent = road;
            roadSel.appendChild(opt);
        });
        }

        if (prefix === "site") updateProjectNameAuto();
    });

    roadSel.addEventListener("change", () => {
        if (prefix === "site") updateProjectNameAuto();
    });
    }

    function getFullAddress(prefix) {
    const city = document.getElementById(prefix + "City").value || "";
    const dist = document.getElementById(prefix + "District").value || "";
    const road = document.getElementById(prefix + "Road").value || "";
    const num = document.getElementById(prefix + "Number").value || "";
    return city + dist + road + (num ? num : "");
    }

    // ========= 案名自動生成：依客戶類型 + 路名 =========
    function updateProjectNameAuto() {
    if (projectNameEdited) return;

    const customerName = document.getElementById("customerName").value.trim();
    const customerType = document.getElementById("customerType").value;
    const siteRoad = document.getElementById("siteRoad").value.trim();

    if (!customerName || !siteRoad || !customerType) return;

    let prefix = "";
    const nameTrim = customerName.replace(/\s+/g, "");

    if (customerType === "先生") {
    const lastName = nameTrim.charAt(0) || "";
    prefix = lastName + "先生";
    } else if (customerType === "小姐") {
    const lastName = nameTrim.charAt(0) || "";
    prefix = lastName + "小姐";
    } else if (customerType === "股份有限公司") {
    prefix = nameTrim.slice(0, 2);
    } else {
    return;
    }

    const autoName = prefix + siteRoad;
    document.getElementById("projectName").value = autoName;
    }

    document.getElementById("customerName").addEventListener("input", () => {
    updateProjectNameAuto();
    });
    document.getElementById("customerType").addEventListener("change", () => {
    updateProjectNameAuto();
    });
    document.getElementById("projectName").addEventListener("input", () => {
    projectNameEdited = true;
    });

    // ========= 建立下拉選單 =========
    function createSelect(options, placeholder) {
    const sel = document.createElement("select");
    const optEmpty = document.createElement("option");
    optEmpty.value = "";
    optEmpty.textContent = placeholder || "— 請選擇 —";
    sel.appendChild(optEmpty);
    options.forEach(v => {
        const opt = document.createElement("option");
        opt.value = v;
        opt.textContent = v;
        sel.appendChild(opt);
    });
    return sel;
    }

    // ========= 新增一列商品 =========
    function addItemRow() {
    itemIndex++;
    const tr = document.createElement("tr");

    const tdIndex = document.createElement("td");
    tdIndex.textContent = itemIndex;

    // 品名
    const tdName = document.createElement("td");
    const productSelect = createSelect(
    [
        "單線板後裝型PVC實木結構門",
        "雙線板後裝型PVC實木結構門",
        "單線板後裝型HDP實木結構門"
    ],
    "— 品名 —"
    );
    tdName.appendChild(productSelect);

    // 顏色
    const tdColor = document.createElement("td");
    const colorSelect = createSelect(
    ["梣木洗白", "相思木", "靜岡白", "鐵刀木"],
    "— 顏色 —"
    );
    tdColor.appendChild(colorSelect);

    // 尺寸
    const tdSize = document.createElement("td");
    const sizeWrapper = document.createElement("div");
    sizeWrapper.className = "size-wrapper";

    const labelW = document.createElement("span");
    labelW.textContent = "寬";
    const inputW = document.createElement("input");
    inputW.type = "number";
    inputW.value = "90";
    inputW.setAttribute("data-size", "width");

    const labelH = document.createElement("span");
    labelH.textContent = "高";
    const inputH = document.createElement("input");
    inputH.type = "number";
    inputH.value = "210";
    inputH.setAttribute("data-size", "height");

    sizeWrapper.appendChild(labelW);
    sizeWrapper.appendChild(inputW);
    sizeWrapper.appendChild(labelH);
    sizeWrapper.appendChild(inputH);
    tdSize.appendChild(sizeWrapper);

    // 數量
    const tdQty = document.createElement("td");
    const inputQty = document.createElement("input");
    inputQty.type = "number";
    inputQty.min = "0";
    inputQty.value = "1";
    tdQty.appendChild(inputQty);

    // 單價
    const tdPrice = document.createElement("td");
    const inputPrice = document.createElement("input");
    inputPrice.type = "number";
    inputPrice.min = "0";
    tdPrice.appendChild(inputPrice);

    // 金額
    const tdAmount = document.createElement("td");
    tdAmount.textContent = "0";

    // 門檔
    const tdDoorStop = document.createElement("td");
    const doorStopSelect = createSelect(
    ["一字型門檔", "磁吸式門檔", "黑色一字型門檔", "自備"],
    "— 門檔 —"
    );
    tdDoorStop.appendChild(doorStopSelect);

    // 把手
    const tdHandle = document.createElement("td");
    const handleSelect = createSelect(
    ["LH600", "LH601", "JB1BN00", "自備"],
    "— 把手 —"
    );
    tdHandle.appendChild(handleSelect);

    // 鉸鍊
    const tdHinge = document.createElement("td");
    const hingeSelect = createSelect(
    ["旗型鉸鍊", "蝶型鉸鍊", "自備"],
    "— 鉸鍊 —"
    );
    tdHinge.appendChild(hingeSelect);

    // 加購
    const tdAddOn = document.createElement("td");
    const addOnSelect = createSelect(
    ["日製下降條", "德國下降條", "無"],
    "— 加購 —"
    );
    tdAddOn.appendChild(addOnSelect);

    // 備註
    const tdNote = document.createElement("td");
    const inputNote = document.createElement("input");
    inputNote.type = "text";
    tdNote.appendChild(inputNote);

    // 操作
    const tdAction = document.createElement("td");
    const btnDel = document.createElement("button");
    btnDel.type = "button";
    btnDel.textContent = "刪除";
    btnDel.className = "btn btn-danger";
    tdAction.appendChild(btnDel);

    // 依序塞入欄位
    tr.appendChild(tdIndex);   // 0
    tr.appendChild(tdName);    // 1
    tr.appendChild(tdColor);   // 2
    tr.appendChild(tdSize);    // 3
    tr.appendChild(tdQty);     // 4
    tr.appendChild(tdPrice);   // 5
    tr.appendChild(tdAmount);  // 6
    tr.appendChild(tdDoorStop);// 7
    tr.appendChild(tdHandle);  // 8
    tr.appendChild(tdHinge);   // 9
    tr.appendChild(tdAddOn);   //10
    tr.appendChild(tdNote);    //11
    tr.appendChild(tdAction);  //12

    itemsTableBody.appendChild(tr);

    function updateRow() {
        const qty = parseFloat(inputQty.value) || 0;
        const price = parseFloat(inputPrice.value) || 0;
        const amount = qty * price;
        tdAmount.textContent = amount.toFixed(0);
        updateTotal();
    }

    inputQty.addEventListener("input", updateRow);
    inputPrice.addEventListener("input", updateRow);

    btnDel.addEventListener("click", () => {
        tr.remove();
        updateTotal();
    });
    }

    // ========= 更新合計 =========
function updateTotal() {
    let subTotal = 0;
    const rows = itemsTableBody.querySelectorAll("tr");
    rows.forEach(row => {
    const amountTd = row.children[6];
    const val = parseFloat(amountTd.textContent) || 0;
    subTotal += val;
    });
    const tax = Math.round(subTotal * 0.05);
    const grand = subTotal + tax;

    subTotalSpan.textContent = subTotal.toFixed(0);
    taxAmountSpan.textContent = tax.toFixed(0);
    grandTotalSpan.textContent = grand.toFixed(0);
}

    document.getElementById("addItemBtn").addEventListener("click", addItemRow);

    // HTML escape
    function esc(str) {
    return String(str || "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
    }

    // ========= 產生報價單 HTML（列印版） =========
    function buildQuoteHtml(data) {
    const {
    quoteNumber, quoteDate, projectName,
    customerName, taxId, contactPerson, contactPhone,
    companyAddress, siteAddress,
    items, subTotal, taxAmount, grandTotal, remarks,
    availableTime, accessCode, parking, floorPlan, unloadingArea, specialNotes
    } = data;

    const itemsRowsHtml = items.map((item, idx) => `
        <tr>
        <td>${idx + 1}</td>
        <td>${esc(item.name)}</td>
        <td>${esc(item.color)}</td>
        <td>${esc(item.sizeWidth)} x ${esc(item.sizeHeight)}</td>
        <td>${esc(item.qty)}</td>
        <td>${esc(item.price)}</td>
        <td>${esc(item.amount)}</td>
        <td>${esc(item.doorStop)}</td>
        <td>${esc(item.handle)}</td>
        <td>${esc(item.hinge)}</td>
        <td>${esc(item.addOn)}</td>
        <td>${esc(item.note)}</td>
        </tr>`).join("");

return String.raw`
<!DOCTYPE html>
<html lang="zh-Hant">
<head>
<meta charset="UTF-8" />
<title>${esc(projectName)} 報價單</title>
<style>
@page { size: A4; margin: 20mm; }
body {
    font-family: Arial, "Microsoft JhengHei", sans-serif;
    margin: 0;
    padding: 0;
}
.quote-container {
    width: 100%;
    box-sizing: border-box;
}
.logo-wrap {
    text-align: center;
    margin-bottom: 4px;
}
.logo-wrap img {
    height: 60px;
}
.company-header {
    text-align: center;
    margin-bottom: 8px;
    font-size: 12px;
}
.company-header .name {
    font-size: 16px;
    font-weight: bold;
}
.title {
    text-align: center;
    font-size: 20px;
    font-weight: bold;
    margin: 6px 0 10px;
}
.row {
    display: flex;
    justify-content: space-between;
    font-size: 11px;
    margin-bottom: 4px;
}
.box {
    border: 1px solid #000;
    padding: 6px;
    font-size: 11px;
    margin-top: 4px;
}
table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 6px;
    font-size: 10px;
}
th, td {
    border: 1px solid #000;
    padding: 3px 4px;
}
th {
    text-align: center;
    background: #f2f2f2;
}
.totals {
    margin-top: 6px;
    font-size: 11px;
    text-align: right;
}
.remark-title {
    font-size: 11px;
    margin-top: 10px;
    margin-bottom: 4px;
}
.remark-box {
    border: 1px solid #000;
    min-height: 40px;
    padding: 4px;
    font-size: 10px;
}
.notice {
    margin-top: 6px;
    font-size: 9px;
    line-height: 1.4;
}
.sign-row {
    margin-top: 14px;
    font-size: 11px;
    display: flex;
    justify-content: space-between;
}
</style>
</head>
<body onload="window.print()">
<div class="quote-container">
<div class="logo-wrap">
    <img src="logo.png" alt="公司 Logo" />
</div>

<div class="company-header">
    <div class="name">豐彩藝術股份有限公司</div>
    <div>splendid-a@splendid-a.com</div>
    <div>統編：50815629　電話：04-36091788　傳真：04-22555377</div>
    <div>407台中市西屯區市政北七路186號4樓之8</div>
</div>

<div class="title">報 價 單</div>

<div class="row">
    <div>報價單號：${esc(quoteNumber)}</div>
    <div>報價日期：${esc(quoteDate)}</div>
</div>

<div class="box">
    <div>案件名稱：${esc(projectName)}</div>
    <div>客戶名稱：${esc(customerName)}</div>
    <div>統一編號：${esc(taxId)}</div>
    <div>聯絡人員：${esc(contactPerson)}</div>
    <div>連絡電話：${esc(contactPhone)}</div>
    <div>公司地址：${esc(companyAddress)}</div>
    <div>工地地址：${esc(siteAddress)}</div>
</div>

<table>
    <thead>
    <tr>
        <th style="width: 26px;">序號</th>
        <th style="width: 85px;">品名</th>
        <th style="width: 75px;">門片/框顏色</th>
        <th style="width: 75px;">尺寸(寬x高)</th>
        <th style="width: 45px;">數量</th>
        <th style="width: 60px;">單價</th>
        <th style="width: 60px;">金額</th>
        <th style="width: 60px;">門檔</th>
        <th style="width: 55px;">把手</th>
        <th style="width: 55px;">鉸鍊</th>
        <th style="width: 60px;">加購</th>
        <th>備註</th>
    </tr>
    </thead>
    <tbody>
    ${itemsRowsHtml}
    </tbody>
</table>

<div class="totals">
    小計：${subTotal}<br/>
    稅額(5%)：${taxAmount}<br/>
    總價：${grandTotal}
</div>

<div class="remark-title">備註欄：</div>
<div class="remark-box">
${esc(remarks).replace(/\n/g, "<br/>")}
</div>

<div class="notice">
    <strong>※付款條件：訂金60%，安裝完成40%。</strong><br/>
    ◎報價有效期限15天。<br/>
    ◎含施工(依備註)。<br/>
    ◎不含隔間補強、打牆、塞漿、油漆及Silicone修補工程。<br/>
    ◎丈量完成後現場尺寸如有變動，需第一時間通知，若無通知，備貨時間將順延。
</div>

<div class="sign-row">
    <div>承辦：楊士奇</div>
    <div>客戶簽章：__________________</div>
</div>
</div>
</body>
</html>`;
    }

    // ========= 產生 PDF（開列印視窗） =========
    document.getElementById("generatePdfBtn").addEventListener("click", () => {
    feedback.textContent = "";
    feedback.className = "message";

    const projectName = document.getElementById("projectName").value.trim();
    const customerName = document.getElementById("customerName").value.trim();
    if (!projectName || !customerName) {
    feedback.textContent = "請先填寫『案件名稱』與『客戶名稱』。";
    feedback.className = "message error";
    return;
    }

    const rows = itemsTableBody.querySelectorAll("tr");
    if (rows.length === 0) {
    feedback.textContent = "請至少新增一筆商品明細。";
    feedback.className = "message error";
    return;
    }

    const quoteNumber = document.getElementById("quoteNumber").value.trim();
    const quoteDate = document.getElementById("quoteDate").value.trim();
    const taxId = document.getElementById("taxId").value.trim();
    const contactPerson = document.getElementById("contactPerson").value.trim();
    const contactPhone = document.getElementById("contactPhone").value.trim();
    const companyAddress = getFullAddress("company");
    const siteAddress = getFullAddress("site");
    const remarks = document.getElementById("remarks").value.trim();

    const availableTime = document.getElementById("availableTime").value.trim();
    const accessCode = document.getElementById("accessCode").value.trim();
    const parking = document.getElementById("parking").value.trim();
    const floorPlan = document.getElementById("floorPlan").value.trim();
    const unloadingArea = document.getElementById("unloadingArea").value.trim();
    const specialNotes = document.getElementById("specialNotes").value.trim();

    const subTotal = parseFloat(subTotalSpan.textContent) || 0;
    const taxAmount = parseFloat(taxAmountSpan.textContent) || 0;
    const grandTotal = parseFloat(grandTotalSpan.textContent) || 0;

    const items = [];
    rows.forEach(row => {
        const name = row.children[1].querySelector("select").value.trim();
        const color = row.children[2].querySelector("select").value.trim();
        const sizeWidthInput = row.children[3].querySelector("input[data-size='width']");
        const sizeHeightInput = row.children[3].querySelector("input[data-size='height']");
        const sizeWidth = sizeWidthInput ? sizeWidthInput.value.trim() : "";
        const sizeHeight = sizeHeightInput ? sizeHeightInput.value.trim() : "";
        const qty = row.children[4].querySelector("input").value.trim();
        const price = row.children[5].querySelector("input").value.trim();
        const amount = row.children[6].textContent.trim();
        const doorStop = row.children[7].querySelector("select").value.trim();
        const handle = row.children[8].querySelector("select").value.trim();
        const hinge = row.children[9].querySelector("select").value.trim();
        const addOn = row.children[10].querySelector("select").value.trim();
        const note = row.children[11].querySelector("input").value.trim();

        if (name || color || sizeWidth || sizeHeight || qty || price ||
            doorStop || handle || hinge || addOn || note) {
        items.push({
        name,
        color,
        sizeWidth,
        sizeHeight,
        qty,
        price,
        amount,
        doorStop,
        handle,
        hinge,
        addOn,
        note
        });
    }
    });

    if (items.length === 0) {
    feedback.textContent = "明細內容皆為空白，請確認資料。";
    feedback.className = "message error";
    return;
    }

    const data = {
        quoteNumber, quoteDate, projectName,
        customerName, taxId, contactPerson, contactPhone,
        companyAddress, siteAddress,
        items, 
        subTotal: subTotal.toFixed(0),
        taxAmount: taxAmount.toFixed(0),
        grandTotal: grandTotal.toFixed(0),
        remarks,

        availableTime, accessCode, parking, floorPlan, unloadingArea, specialNotes
    };

    const printHtml = buildQuoteHtml(data);
    const printWindow = window.open("", "_blank");
    printWindow.document.open();
    printWindow.document.write(printHtml);
    printWindow.document.close();

    feedback.textContent = "已開啟列印視窗，請選擇「另存為 PDF」存檔。";
    feedback.className = "message success";
    });

    // ========= 初始化 =========
    initQuoteDateAndNumber();
    initAddressSelectors("company");
    initAddressSelectors("site");
    addItemRow();
