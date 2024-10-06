import { Box, Button, Stack } from '@mui/material';
import { TextField, IconButton, InputAdornment } from '@mui/material';
import { Table, TableHead, TableBody, TableRow, TableCell } from '@mui/material';

import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

import Typography from '@mui/material/Typography';

import { Add as AddIcon } from '@mui/icons-material';
import { Close as CloseIcon } from '@mui/icons-material';


function Header(props){
	return(
		<Stack gap="24px">
			<TextField
				label="Company Name"
				value={props.companyName}
				onChange={e => props.setCompanyName(e.target.value)}/>
			
			<TextField
				label="Project Address"
				value={props.projectAddress}
				onChange={e => props.setProjectAddress(e.target.value)}/>

			<TextField 
				label="P.O. Number"
				value={props.poNumber}
				onChange={e => props.setPoNumber(e.target.value)}/>
			
			<TextField
				label="Bill To"
				value={props.billTo}
				onChange={e => props.setBillTo(e.target.value)}/>
			
			<LocalizationProvider dateAdapter={AdapterDayjs}>
				<DatePicker
					label="Date"
					value={props.date}
					onChange={e => props.setDate(e)}/>
			</LocalizationProvider>
			
			<TextField
				label="Invoice Number"
				value={props.invoiceNumber}
				onChange={e => props.setInvoiceNumber(e.target.value)}/>
		</Stack>
	)
}

function InvoiceItem(props){
	return(
		<TableRow>
			<TableCell>
				<TextField
					placeholder="Description"
					fullWidth
					value={props.data.description}
					onChange={e => props.setItemProperty("description", e.target.value)}/>
			</TableCell>
			<TableCell>
				<TextField
					placeholder="0.00"
					fullWidth
					value={props.data.rate || ""}
					onChange={e => {
						// Only allow number entry up to two decimal places
						if(e.target.value.match(/^[0-9]*(\.[0-9]{0,2})?$/)){
							props.setItemProperty("rate", e.target.value);
							props.setItemProperty("amount", (e.target.value * props.data.qty));
						}
					}}
					slotProps={{
						input: { startAdornment: <InputAdornment position="start">$</InputAdornment> },
						htmlInput: { inputMode: "numeric" } // Prompt mobile browsers to open a numpad instead of keyboard
					}}/>
			</TableCell>
			<TableCell>
				<TextField
					placeholder="0"
					fullWidth
					value={props.data.qty}
					onChange={e => {
						// Only allow number entry
						if(e.target.value.match(/^(|\d)+$/)){
							props.setItemProperty("qty", e.target.value);
							props.setItemProperty("amount", (props.data.rate * e.target.value));
						}
					}}
					slotProps={{
						htmlInput: { inputMode: "numeric" } // Prompt mobile browsers to open a numpad instead of keyboard
					}}/>
			</TableCell>
			<TableCell align="right">
				<Typography variant="body1">$ {parseFloat(props.data.amount).toFixed(2)}</Typography>
			</TableCell>
			<TableCell align="right">
				<Box>
					<IconButton onClick={() => props.handleDelete(props.id)}>
						<CloseIcon/>
					</IconButton>
				</Box>
			</TableCell>
		</TableRow>
	)
}

export default function Form(props){
	function addNewItem(){
		props.setItems([...props.items, { description: "", rate: 0.00, qty: 1, amount: 0.00, }]);
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

	return(
		<Stack gap="64px" sx={{ ...props.sx, padding: "32px", background: "white" }}>
			<Header
				companyName={props.companyName} setCompanyName={name => {
					localStorage.setItem("companyName", name);
					props.setCompanyName(name);
				}}
				projectAddress={props.projectAddress} setProjectAddress={props.setProjectAddress}
				poNumber={props.poNumber} setPoNumber={props.setPoNumber}
				billTo={props.billTo} setBillTo={props.setBillTo}
				date={props.date} setDate={props.setDate}
				invoiceNumber={props.invoiceNumber} setInvoiceNumber={props.setInvoiceNumber}/>

			
			<div>
				<Typography variant="h6">Items</Typography>

				<Table>
					<TableHead>
						<TableRow>
							<TableCell>Item</TableCell>
							<TableCell sx={{ width: "12.5%" }}>Rate</TableCell>
							<TableCell sx={{ width: "7.5%" }}>Qty</TableCell>
							<TableCell sx={{ width: "20%" }} align="right">Amount</TableCell>
							<TableCell sx={{ width: "15%" }} align="right">
								<Button
									size="small"
									variant="contained"
									startIcon={<AddIcon/>}
									onClick={addNewItem}>New Item</Button>
							</TableCell>
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
									handleDelete={deleteItem}/>
							))
						}
					</TableBody>
				</Table>
			</div>

			{/* TODO remove PDF preview, use the react preview for better styling
			<Button variant="contained" size="large" onClick={() => setPdfModalOpen(true)}>Generate</Button>
			*/}
		</Stack>
	)
}

