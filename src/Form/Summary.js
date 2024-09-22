import { useState, useEffect } from "react";

import { TableRow, TableCell } from '@mui/material';

export default function Summary(props){
	return(
		<>
			<TableRow>
				<TableCell rowSpan={4} colSpan={2}/>
				<TableCell>Subtotal</TableCell>
				<TableCell>{props.data.subtotal}</TableCell>
			</TableRow>
			
			<TableRow>
				<TableCell>Tax</TableCell>
				<TableCell>{props.data.tax}</TableCell>
			</TableRow>
			
			<TableRow>
				<TableCell>Total</TableCell>
				<TableCell>{props.data.total}</TableCell>
			</TableRow>
		</>
	)
}