import { Button, Stack, Divider, TableHead, TableFooter } from '@mui/material';
import { TextField, IconButton, InputAdornment } from '@mui/material';
import { Table, TableBody, TableRow, TableCell } from '@mui/material';

import StyledPaper from './StyledPaper';

import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

import Typography from '@mui/material/Typography';

import { Add as AddIcon } from '@mui/icons-material';
import { DeleteOutlineOutlined as DeleteIcon } from '@mui/icons-material';

import generatePDF from '../PDFGenerator';


function InvoiceItem(props){
	// Add a new InvoiceItem if "enter" is pressed when typing in a TextField
	function handleEnterKeypress(e){
		if (e.key === 'Enter') {
			e.preventDefault();	// Prevent default action
			props.addNewItem();
		}
	}

	return(
		<TableRow>
			<TableCell>
				<TextField
					placeholder="Enter item"
					hiddenLabel
					fullWidth
					size="small"
					value={props.data.description}
					onKeyDown={handleEnterKeypress}
					onChange={e => props.setItemProperty("description", e.target.value)}
					autoFocus={props.autoFocus}/>
			</TableCell>

			<TableCell>
				<TextField
					placeholder="0"
					hiddenLabel
					type="number"
					fullWidth
					size="small"
					value={props.data.qty}
					onKeyDown={handleEnterKeypress}
					onChange={e => {
						// Only allow number entry
						if (e.target.value.match(/^(|\d)+$/)) {
							props.setItemProperty("qty", e.target.value);
							props.setItemProperty("amount", (props.data.rate * e.target.value));
						}
					}}
					slotProps={{
						htmlInput: { inputMode: "numeric" } // Prompt mobile browsers to open a numpad instead of keyboard
					}} />
			</TableCell>

			<TableCell>
				<TextField
					placeholder="0.00"
					hiddenLabel
					fullWidth
					size="small"
					value={props.data.rate || ""}
					onKeyDown={handleEnterKeypress}
					onChange={e => {
						// Only allow number entry up to two decimal places
						if (e.target.value.match(/^[0-9]*(\.[0-9]{0,2})?$/)) {
							props.setItemProperty("rate", e.target.value);
							props.setItemProperty("amount", (e.target.value * props.data.qty));
						}
					}}
					slotProps={{
						input: { startAdornment: <InputAdornment position="start">$</InputAdornment> },
						htmlInput: { inputMode: "numeric" } // Prompt mobile browsers to open a numpad instead of keyboard
					}} />
			</TableCell>

			<TableCell>
				<IconButton size="small" onClick={() => props.handleDelete(props.id)}>
					<DeleteIcon/>
				</IconButton>
			</TableCell>
		</TableRow>
	)
}


export default function Form(props){
	function addNewItem(){
		props.setItems([...props.items, { description: "", qty: 1, rate: 0.00, amount: 0.00, }]);
	}


	function deleteItem(index){
		let temp = [...props.items];
		temp.splice(index, 1);
		props.setItems(temp);
	}


	function setItemProperty(property, value, index){
		let temp = [...props.items];
		temp[index][property] = value;
		props.setItems(temp);
	}


	function handleGeneratePDFClick(){
		generatePDF(
			props.companyName,
			props.companyEmail,
			props.companyPhone,
			props.companyBusinessNumber,
			props.date,
			props.invoiceNumber,
			props.customerName,
			props.projectAddress,
			props.notes,
			props.items,
			props.summary
		)
	}


	return(
		<Stack gap="16px" paddingTop="32px" sx={{ ...props.sx }}>
			<Stack gap="16px" direction="row" justifyContent="space-between">
				<Typography variant="h1">
					Create invoice
				</Typography>
				<Button
					variant="contained"
					onClick={handleGeneratePDFClick}>Generate PDF</Button>
			</Stack>

			<Stack gap="16px" direction="row">
				<Stack gap="16px" flex={2}>
					<StyledPaper>
						<Typography variant="h2">Company</Typography>
						
						<TextField
							label="Company Name"
							value={props.companyName}
							onChange={e => props.setCompanyName(e.target.value)}/>
						
						<TextField
							label="Email"
							value={props.companyEmail}
							onChange={e => props.setCompanyEmail(e.target.value)}/>
						
						<TextField
							label="Phone"
							value={props.companyPhone}
							onChange={e => props.setCompanyPhone(e.target.value)}/>
						
						<TextField
							label="Business Number"
							value={props.companyBusinessNumber}
							onChange={e => props.setCompanyBusinessNumber(e.target.value)}/>
					</StyledPaper>
					
					<StyledPaper>
						<Typography variant="h2">Invoice</Typography>
						<Stack direction="row" gap="16px">
							<LocalizationProvider dateAdapter={AdapterDayjs}>
								<DatePicker
									format="LL"
									label="Date"
									value={props.date}
									onChange={e => props.setDate(e)}/>
							</LocalizationProvider>

							<TextField
								label="Invoice Number"
								value={props.invoiceNumber}
								onChange={e => props.setInvoiceNumber(e.target.value)}/>
						</Stack>

						{/* Items Form */}
						<Table>
							<TableBody>
								<TableHead>
									<TableRow>
										<TableCell sx={{ width: "50%" }}>Item</TableCell>
										<TableCell sx={{ width: "15%" }}>Quantity</TableCell>
										<TableCell>Rate</TableCell>
										<TableCell/>
									</TableRow>
								</TableHead>

								<TableBody>
									{
										props.items.map((item, index) => (
											<InvoiceItem
												key={index}
												id={index}
												data={item}
												setItemProperty={(property, value) => setItemProperty(property, value, index)}
												handleDelete={deleteItem}
												// Autofocus newly added items
												autoFocus={ (index === props.items.length - 1) && index !== 0 }
												addNewItem={addNewItem}/>
										))
									}
								</TableBody>

								<TableFooter>
									<TableRow>
										<TableCell sx={{ borderBottom: 'none' }}>
											<Button
												variant="text"
												size="small"
												startIcon={<AddIcon />}
												onClick={addNewItem}>New Item</Button>
										</TableCell>
									</TableRow>
								</TableFooter>
							</TableBody>
						</Table>

						<TextField
							label="Notes (optional)"
							value={props.notes}
							onChange={e => props.setNotes(e.target.value)}
							multiline
							minRows={3}/>
					</StyledPaper>
				</Stack>

				<Stack gap="16px" flex={1}>
					<StyledPaper>
						<Typography variant="h2">Invoice Details</Typography>
						
						<TextField
							label="Bill To"
							value={props.customerName}
							onChange={e => props.setCustomerName(e.target.value)}/>

						<TextField
							label="Address"
							value={props.projectAddress}
							onChange={e => props.setProjectAddress(e.target.value)}/>

						<Divider/>
						
						{/* Summary */}
						<Stack direction="row" justifyContent="space-between">
							<Typography variant="body2" style={{ color: "#969696" }}>Subtotal</Typography>
							<Typography variant="body2">${parseFloat(props.summary.subtotal).toFixed(2)}</Typography>
						</Stack>

						<Stack direction="row" justifyContent="space-between">
							<Typography variant="body2" style={{ color: "#969696" }}>Tax</Typography>
							<Typography variant="body2">${parseFloat(props.summary.subtotal).toFixed(2)}</Typography>
						</Stack>

						<Stack direction="row" justifyContent="space-between">
							<Typography variant="body2" style={{ color: "#969696" }}>Total</Typography>
							<Typography variant="body2" style={{ fontWeight: 600 }}>${parseFloat(props.summary.total).toFixed(2)}</Typography>
						</Stack>
					</StyledPaper>
				</Stack>
			</Stack>
		</Stack>
	)
}

