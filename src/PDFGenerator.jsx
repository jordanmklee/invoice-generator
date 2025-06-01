import jspdf from 'jspdf';
import autoTable from 'jspdf-autotable';


export default function generatePDF(
							companyName,
							customerName,
							date,
							invoiceNumber,
							projectAddress,
							notes,
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


	// Title
	doc.setFontSize(16);
	doc.setFont(undefined, "bold")
	
	doc.text(companyName, cursorX, cursorY);
	
	doc.setFontSize(12);
	doc.setFont(undefined, "normal")
	
	const textWidth = doc.getTextWidth("Invoice");
	cursorX = margin + usableWidth - textWidth;
	doc.text("Invoice", cursorX, cursorY);

	cursorNewLine();
	
	
	// Invoice details
	let invoiceDetailsBody = [["Date", date.format("LL")]];
	if(invoiceNumber !== "") invoiceDetailsBody.push(["Invoice No.", invoiceNumber]);

	autoTable(doc, {
		theme: "grid",
		startY: cursorY,
		margin: { left: (margin+2*(usableWidth/3)), right: margin },
		body: invoiceDetailsBody,
		columnStyles: {
			0: { textColor: "#969696" },
			1: { halign: "right" }
		}
	});
	cursorY = doc.lastAutoTable.finalY + lineHeight;


	// Customer details
	let customerDetailsHead = [];
	let customerDetailsBody = [];
	if(customerName !== ""){
		customerDetailsHead.push("Bill to");
		customerDetailsBody.push(customerName);
	}
	if(projectAddress !== ""){
		customerDetailsHead.push("Address");
		customerDetailsBody.push(projectAddress);
	}

	autoTable(doc, {
		theme: "plain",
		startY: cursorY,
		margin: { left: margin, right: margin },
		head: [customerDetailsHead],
		body: [customerDetailsBody],
		headStyles: {
			fillColor: "#FFFFFF",
			textColor: "#969696",
			fontStyle: "normal",
			fontSize: 8
		},
		styles: {
			cellWidth: usableWidth/2,
		},
	});
	cursorY = doc.lastAutoTable.finalY + lineHeight;


	// Notes
	if(notes !== ""){
		autoTable(doc, {
			theme: "plain",
			startY: cursorY,
			margin: { left: margin, right: margin },
			body: [[notes]]
		});
		cursorY = doc.lastAutoTable.finalY + lineHeight;
	}
	cursorNewLine();


	// Items
	autoTable(doc, {
		theme: "grid",
		startY: cursorY,
		margin: { left: margin, right: margin },
		head: [['Description', 'Quantity', 'Rate', 'Amount']],
		body: items.map(item => [
			item.description,
			item.qty,
			"$" + parseFloat(item.rate).toFixed(2),
			"$" + parseFloat(item.amount).toFixed(2),
		]),
		headStyles: {
			fillColor: "#FBFBFB",
			textColor: "#969696",
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
			0: { cellWidth: (50 * (usableWidth/100)) },
			3: { halign: 'right' },
		},
		bodyStyles: {
			cellPadding: 4,
			textColor: "#000000",
		}
	});
	cursorY = doc.lastAutoTable.finalY + lineHeight;


	// Summary
	autoTable(doc, {
		theme: "plain",
		startY: cursorY,
		margin: { left: (margin+2*(usableWidth/3)), right: margin },
		body: [
			['Subtotal', "$" + parseFloat(summary.subtotal).toFixed(2)],
			['Tax', "$" + parseFloat(summary.tax).toFixed(2)],
		],
		columnStyles: {
			0: { textColor: "#969696" },
			1: { halign: 'right' }
		}
	})
	cursorY = doc.lastAutoTable.finalY + lineHeight;

	cursorX = (margin+2*(usableWidth/3));
	doc.setDrawColor("#C7C7C7");	// Light grey
	doc.setLineWidth(0.15);
	doc.line(cursorX, cursorY, (margin + usableWidth), cursorY);
	cursorNewLine();


	autoTable(doc, {
		theme: "plain",
		startY: cursorY,
		margin: { left: (margin+2*(usableWidth/3)), right: margin },
		body: [
			['Total', "$" + parseFloat(summary.total).toFixed(2)],
		],
		styles: {
			fontSize: "12"
		},
		columnStyles: {
			0: { textColor: "#969696" },
			1: { halign: 'right', fontStyle: 'bold' }
		}
	})
	cursorY = doc.lastAutoTable.finalY + lineHeight;


	doc.save("generated.pdf")
	return;
}

