import { Stack, TextField } from '@mui/material';

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';


export default function Headers(props){
	return(
		<Stack gap="24px">
			<TextField
				label="Company Name"
				value={props.companyName}
				onChange={e => props.setCompanyName(e.target.value)}/>

			<Stack direction="row" gap="24px" sx={{ justifyContent: "space-between" }}>
				<Stack gap="24px" flex={1}>
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
				</Stack>
				
				<Stack direction="row" gap="24px">
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
			</Stack>
		</Stack>
	)
}