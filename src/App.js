import { useState, useEffect } from "react";

import { Box, Stack, Modal } from '@mui/material';

import { PDFViewer } from '@react-pdf/renderer';

import dayjs from "dayjs";

import Form from "./components/Form";
import InvoicePreview from "./components/InvoicePreview";
import GeneratedDocument from "./components/GeneratedDocument";

import './App.css';


export default function App(){
	const [pdfModalOpen, setPdfModalOpen] = useState(false);

	const [companyName, setCompanyName] = useState(localStorage.getItem("companyName"));
	const [billTo, setBillTo] = useState("");
	const [date, setDate] = useState(dayjs(new Date()));
	const [invoiceNumber, setInvoiceNumber] = useState("");
	const [projectAddress, setProjectAddress] = useState("");
	const [poNumber, setPoNumber] = useState("");

	const [items, setItems] = useState([]);
	const [summary, setSummary] = useState({
		subtotal: 0.00,
		tax: 0.00,
		total: 0.00
	});


	// Update the summary on invoice item change
	useEffect(() => {
		let subtotal = 0.00;
		items.forEach(item => {
			subtotal += item.amount;
		})

		let tax = subtotal * 0.05;
		let total = subtotal + tax;

		setSummary({
			subtotal: subtotal,
			tax: tax,
			total: total,
		})
	}, [items])


	return(
		<Stack direction="row" style={{ height: "100vh", background: "grey" }}>
			<Modal open={pdfModalOpen} onClose={() => setPdfModalOpen(false)}>
				<Box sx={{ position: 'absolute',
					top: "50%",
					left: "50%",
					transform: "translate(-50%, -50%)",
					width: "80%",
					height: "80%",
					color: "white",
					padding: "16px" }}>
					<PDFViewer style={{ width: "100%", height: "100%" }}>
						<GeneratedDocument
							companyName={companyName}
							billTo={billTo}
							date={date}
							invoiceNumber={invoiceNumber}
							projectAddress={projectAddress}
							poNumber={poNumber}
							items={items}
							summary={summary}/>
					</PDFViewer>
				</Box>
			</Modal>

			<Form
				companyName={companyName} setCompanyName={setCompanyName}
				billTo={billTo} setBillTo={setBillTo}
				date={date} setDate={setDate}
				invoiceNumber={invoiceNumber} setInvoiceNumber={setInvoiceNumber}
				projectAddress={projectAddress} setProjectAddress={setProjectAddress}
				poNumber={poNumber} setPoNumber={setPoNumber}
				items={items} setItems={setItems}
				summary={summary}
				sx={{ flex: 1, overflowY: "auto" }}/>

			<InvoicePreview
				companyName={companyName}
				billTo={billTo}
				date={date}
				invoiceNumber={invoiceNumber}
				projectAddress={projectAddress}
				poNumber={poNumber}
				items={items}
				summary={summary}
				sx={{ flex: 2, overflowY: "auto" }}/>
		</Stack>
	)
}
