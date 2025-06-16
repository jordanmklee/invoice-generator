import jspdf from 'jspdf';
import autoTable from 'jspdf-autotable';


export default function generatePDF(company, invoice){
	const doc = new jspdf({ format: 'a4' });

	// 1 inch margins
	const margin = 25.4;
	const usableWidth = doc.internal.pageSize.getWidth() - (2 * margin);

	const fontSize = 12;
	doc.setFontSize(fontSize);
	
	const lineSpacing = 1.15;
	const lineHeight = fontSize * lineSpacing * 0.3528; // convert pt to mm

	// Set cursor initial position to top left corner
	let cursorX = margin;
	let cursorY = margin;



	const tableStyles = {
		lineColor: "#000000"
	}
	const headingStyles = {
		fillColor: "#FFFFFF",
		textColor: "#000000",
		fontStyle: "normal",
		fontSize: 10,
		lineColor: "#000000",
		cellPadding: { bottom: 2 },
	}
	const bodyStyles = {
		cellPadding: 0,
	}
	const itemRowStyles = {
		cellPadding: 4,
		textColor: "#000000",
	}

	function cursorNewLine(){
		cursorX = margin;	// TODO this is redundant since cursorX will likely not change
		cursorY += lineHeight;
	}

	function divider(){
		doc.setDrawColor("#000000");
		doc.line(cursorX, cursorY, (cursorX + usableWidth), cursorY);
		cursorNewLine();
		cursorNewLine();
	}


	// Title
	doc.setFontSize(16);
	doc.setFont(undefined, "bold")
	
	doc.text(company.name, cursorX, cursorY);
	
	doc.setFontSize(12);
	doc.setFont(undefined, "normal")
	
	const textWidth = doc.getTextWidth("Invoice");
	cursorX = margin + usableWidth - textWidth;
	doc.text("Invoice", cursorX, cursorY);

	cursorNewLine();



	let companyDetailsBody = [];
	if(company.email !== "") companyDetailsBody.push([company.email]);
	if(company.phone !== "") companyDetailsBody.push([company.phone]);
	if(company.businessNumber !== "") companyDetailsBody.push([company.businessNumber]);
	
	autoTable(doc, {
		theme: "plain",
		start: cursorY,
		margin: { left: margin, right: margin, top: cursorY },
		body: companyDetailsBody,
		styles: { cellPadding: { bottom: 2 } }
	});

	let companyDetailsBodyHeight = doc.lastAutoTable.finalY + lineHeight;

	
	// Invoice details
	let invoiceDetailsBody = [["Date", invoice.date.format("LL")]];
	if(invoice.number !== "") invoiceDetailsBody.push(["Invoice No.", invoice.number]);

	autoTable(doc, {
		theme: "grid",
		startY: cursorY,
		margin: { left: (margin+2*(usableWidth/3)), right: margin },
		body: invoiceDetailsBody,
		styles: {...tableStyles, textColor: "#000000"},
		columnStyles: { 1: { halign: "right" } }
	});

	let invoiceDetailsBodyHeight = doc.lastAutoTable.finalY +  lineHeight;
	cursorY = (companyDetailsBodyHeight > invoiceDetailsBodyHeight) ? companyDetailsBodyHeight : invoiceDetailsBodyHeight;

	divider();

	// Customer details
	let customerDetailsHead = [];
	let customerDetailsBody = [];
	if(invoice.customer !== ""){
		customerDetailsHead.push("Bill to");
		customerDetailsBody.push(invoice.customer);
	}
	if(invoice.address !== ""){
		customerDetailsHead.push("Address");
		customerDetailsBody.push(invoice.address);
	}

	autoTable(doc, {
		theme: "plain",
		startY: cursorY,
		margin: { left: margin, right: margin },
		head: [customerDetailsHead],
		body: [customerDetailsBody],
		headStyles: headingStyles,
		bodyStyles: bodyStyles,
		styles: {
			cellWidth: usableWidth/2,
		},
	});
	cursorY = doc.lastAutoTable.finalY + lineHeight;


	// Notes
	if(invoice.notes !== ""){
		autoTable(doc, {
			theme: "plain",
			startY: cursorY,
			margin: { left: margin, right: margin },
			body: [[invoice.notes]]
		});
		cursorY = doc.lastAutoTable.finalY + lineHeight;
	}
	cursorNewLine();
	cursorNewLine();

	// Items
	autoTable(doc, {
		theme: "grid",
		startY: cursorY,
		margin: { left: margin, right: margin },
		head: [['Description', 'Quantity', 'Rate', 'Amount']],
		body: invoice.items.list.map(item => [
			item.description,
			item.qty,
			"$" + parseFloat(item.rate).toFixed(2),
			"$" + parseFloat(item.amount).toFixed(2),
		]),
		headStyles: {...headingStyles, cellPadding: { left: 4, bottom: 2, right: 4 }},
		// Dynamically right-justify the "Amount" column header (ie. column 3)
		didParseCell: function (data) {
			if (data.section === 'head' && data.column.index === 3) {
				data.cell.styles.halign = 'right';
			}
		},
		columnStyles: {
			0: { cellWidth: (50 * (usableWidth/100)) },
			3: { halign: 'right' },
		},
		bodyStyles: itemRowStyles,
		styles: tableStyles
	});
	cursorY = doc.lastAutoTable.finalY + lineHeight;


	// Summary
	autoTable(doc, {
		theme: "plain",
		startY: cursorY,
		margin: { left: (margin+2*(usableWidth/3)), right: margin },
		body: [
			['Subtotal', "$" + parseFloat(invoice.items.summary.subtotal).toFixed(2)],
			['Tax', "$" + parseFloat(invoice.items.summary.tax).toFixed(2)],
		],
		columnStyles: { 1: { halign: 'right' } }
	})
	cursorY = doc.lastAutoTable.finalY + lineHeight;

	cursorX = (margin+2*(usableWidth/3));
	doc.setDrawColor("#000000");	// Light grey
	doc.line(cursorX, cursorY, (margin + usableWidth), cursorY);
	cursorNewLine();


	autoTable(doc, {
		theme: "plain",
		startY: cursorY,
		margin: { left: (margin+2*(usableWidth/3)), right: margin },
		body: [
			['Total', "$" + parseFloat(invoice.items.summary.total).toFixed(2)],
		],
		styles: { fontSize: "12" },
		columnStyles: { 1: { halign: 'right', fontStyle: 'bold' } }
	})
	cursorY = doc.lastAutoTable.finalY + lineHeight;


	// Generate a blob and open in new tab
	const blob = doc.output("blob");
	const url = URL.createObjectURL(blob);
	window.open(url, "_blank");
	return;
}

