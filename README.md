# SmartContracts
Blockchain is a technology developed several years ago with many applications, which have been wasted today. Therefore, in the case of the Impreandes project, which is a web page that has the objective of offering the 3D printing service within the academic environment of the University of Los Andes, a group of smart contracts based on the architecture of hyperledger sawtooth, which has the objective of modeling the process from quotation to printing and payment. This, to provide Impreandes with a reliable system in which actors such as users, manufacturers, and administrators can carry out transactions safely. As a result, five smart contracts have obtained that shape the Impreandes process, ensuring that it ensures that the transactions made have integrity, availability, and confidentiality. These contracts manage to communicate asynchronously with the website and the cryptocurrency.
Thanks to these contracts, it was possible to create a system that ensures that the transactions made by ImpreAndes have integrity, availability and confidentiality, quality attributes that manage to give confidence to the Impreandes actors.
To learn more about Hyperledger Sawtooth please see its [sawtooth-core repo](https://github.com/hyperledger/sawtooth-core) or its [published docs](https://sawtooth.hyperledger.org/docs/).

## Installation
To initialize this project, it is recommended to install it on a Linux operating system.
This project utilizes [Docker](https://www.docker.com/what-docker) to simplify dependencies and deployment. After cloning this repo, follow the instructions specific to your OS to install and run whatever components are required to use `docker` and `docker-compose` from your command line. This is only dependency required to run Supply Chain components.

## Start Up
There are two ways to initialize this project.

### Case 1
In case you want to start without having environment dependencies. Inside the smart-contracts folder, open a console and run the following command:

```bash
sudo ./init.sh
```
Once all the dependencies have been added, everything must be initialized with the following command.
```bash
sudo ./up.sh
```
### Case 2
If the cryptocurrency is in a different port, the doker-compose.yam file must be modified by changing the path of the cryptocurrency correctly.
```bash
APPORG0APP0_PORT=http://134.209.216.13:3000
```
Subsequently, the following command must be run.

```bash
docker-compose up
```

With when the files have been correctly initialized, they can be seen in the following paths.

- Quote Contract: **http://localhost:3001/api-docs**
- Money Separation Contract: **http://localhost:3003/api-docs**
- Print Contract: **http://localhost:3002/api-docs**
- Print Money Contract: **http://localhost:3004/api-docs**
- Return Contract: **http://localhost:3005/api-docs**

## License
Hyperledger Sawtooth software is licensed under the
[Apache License Version 2.0](LICENSE) software license.

Hyperledger Sawtooth Supply Chain documentation in the [docs](docs)
subdirectory is licensed under a Creative Commons Attribution 4.0 International
License.  You may obtain a copy of the license at:
http://creativecommons.org/licenses/by/4.0/.
