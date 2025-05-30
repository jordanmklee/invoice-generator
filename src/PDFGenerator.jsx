import jspdf from 'jspdf';
import autoTable from 'jspdf-autotable';


export default function generatePDF(
							companyName,
							billTo,
							date,
							invoiceNumber,
							projectAddress,
							poNumber,
							items,
							summary
						){
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


	function cursorNewLine(){
		cursorX = margin;	// TODO this is redundant since cursorX will likely not change
		cursorY += lineHeight;
	}

	function write(text){
		doc.splitTextToSize(text, usableWidth).forEach((line) => {
			doc.text(line, cursorX, cursorY);
			cursorNewLine();
		});
	}

	function writeWithHeading(text, heading){
		// Heading is smaller, in grey
		doc.setFontSize(10);
		doc.setTextColor(100);
		doc.text(heading, cursorX, cursorY);
		doc.setFontSize(12);
		doc.setTextColor(0);
		cursorNewLine();

		doc.text(text, cursorX, cursorY);
		cursorNewLine();
		cursorNewLine();
	}

	function divider(){
		doc.setDrawColor(200);	// Light grey
		doc.setLineWidth(0.3);	// optional: thinner line
		doc.line(cursorX, cursorY, (cursorX + usableWidth), cursorY);
		cursorNewLine();
	}


	// Title
	doc.text(companyName, cursorX, cursorY);

	doc.setFontSize(16);
	doc.setFont(undefined, "bold")

	const textWidth = doc.getTextWidth("INVOICE");
	cursorX = margin + usableWidth - textWidth;
	doc.text("INVOICE", cursorX, cursorY);
	
	doc.setFontSize(12);
	doc.setFont(undefined, "normal")
	cursorNewLine();
	

	// Invoice details
	autoTable(doc, {
		theme: "grid",
		startY: cursorY,
		margin: { left: (margin+2*(usableWidth/3)), right: margin },
		body: [
			["Invoice No.", invoiceNumber],
			["Date", date.format("LL")],
		],
		columnStyles: { 1: { halign: "right" } }
	});
	cursorY = doc.lastAutoTable.finalY + lineHeight;

	divider();


	// Bill to and Address
	autoTable(doc, {
		theme: "grid",
		startY: cursorY,
		margin: { left: margin, right: margin },
		head: [['Bill to', 'Address']],
		body: [[billTo, projectAddress]],
		headStyles: {
			fillColor: "#FFFFFF",
			textColor: "#000000",
			fontStyle: "normal",
			fontSize: 8
		},
		styles: {
			cellWidth: usableWidth/2,
		},
	});
	cursorY = doc.lastAutoTable.finalY + lineHeight;


	// Notes
	autoTable(doc, {
		theme: "plain",
		startY: cursorY,
		margin: { left: margin, right: margin },
		head: [['Notes']],
		body: [[poNumber]],
		headStyles: {
			fillColor: "#FFFFFF",
			textColor: "#000000",
			fontStyle: "normal",
			fontSize: 8
		}
	});
	cursorY = doc.lastAutoTable.finalY + lineHeight;


	// Items
	autoTable(doc, {
		theme: "grid",
		startY: cursorY,
		margin: { left: margin, right: margin },
		head: [['Description', 'Rate', 'Quantity', 'Amount']],
		body: items.map(item => [
			item.description,
			"$" + parseFloat(item.rate).toFixed(2),
			item.qty,
			"$" + parseFloat(item.amount).toFixed(2),
		]),
		headStyles: {
			fillColor: "#EBEBEB",
			textColor: "#000000",
			fontStyle: "normal",
			fontSize: 8
		},
		// Dynamically right-justify the "Amount" column header (ie. column 3)
		didParseCell: function (data) {
			if (data.section === 'head' && data.column.index === 3) {
				data.cell.styles.halign = 'right';
			}
		},
		columnStyles: {
			3: { halign: 'right' },
		},
	});
	cursorY = doc.lastAutoTable.finalY + lineHeight;


	// Summary
	autoTable(doc, {
		theme: "grid",
		startY: cursorY,
		margin: { left: (margin+(usableWidth/2)), right: margin },
		body: [
			['Subtotal', "$" + parseFloat(summary.subtotal).toFixed(2)],
			['Tax', "$" + parseFloat(summary.tax).toFixed(2)],
			['Total', "$" + parseFloat(summary.total).toFixed(2)]
		],
		styles: {
			halign: 'right', // aligns text inside cells to right
		},
		columnStyles: {
			0: { halign: 'right' },
			1: { halign: 'right', fontStyle: 'bold' }
		}
	});
	cursorY = doc.lastAutoTable.finalY + lineHeight;


	doc.save("generated.pdf")
	return;
}

