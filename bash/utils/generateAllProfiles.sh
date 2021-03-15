#!/bin/bash
#
# SPDX-License-Identifier: Apache-2.0
#
mkdir -p ../../gateways
node manage-connection-profile.js --generate impreAndesUsersorg ImpreAndesUsersOrgMSP 7051 7054
node manage-connection-profile.js --generate printerorg PrinterOrgMSP 8051 8054
node manage-connection-profile.js --generate senecasorg SenecasOrgMSP 9051 9054
node manage-connection-profile.js --generate regulatororg RegulatorOrgMSP 10051 10054
