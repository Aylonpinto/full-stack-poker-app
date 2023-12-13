

import * as React from 'react';
import _ from 'lodash';

import Table from '@mui/joy/Table';
import Sheet from '@mui/joy/Sheet'


export default function Balance(props) {
    const body = _.map(props.data, (balance, name) => {
        return (<tr>
                    <td>{name}</td>
                    <td>{`€${balance}`}</td>
                </tr>)
        
    })
    return (<Sheet>
                <Table
                borderAxis="xBetween"
                color="neutral"
                size="md"
                stickyFooter
                stickyHeader
                stripe="odd"
                variant="soft"
                >
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Balance</th>
                    </tr>
                </thead>
                <tbody>
                    {body}
                </tbody>
                </Table>
            </Sheet>)
}
