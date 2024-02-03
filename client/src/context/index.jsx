// web3 logic js

import React, {useContext, createContext} from 'react';
import { contractAbi } from "../constants";
import {useAddress, useContract,useMetamask,useContractWrite} from '@thirdweb-dev/react';
import {ethers} from 'ethers';
import { createCampaign } from '../assets';

const StateContext = createContext();

export const StateContextProvider = ({children}) => {
    //https://stackoverflow.com/questions/75828408/contract-undefined-in-thirdweb-dev-react
    const {contract} = useContract('0xeF685b3d4e56D172f3b1428D87AB754286a5d4B3',contractAbi);
    const {mutateAsync : createCampaign} = useContractWrite(contract,'createCampaign'); 
    //for user to send money and mutate our db balance

    const address = useAddress();
    const connect = useMetamask();
    
    const publishCampaign = async (form) => {

        try {
            const data = await createCampaign({
				args: [
					address, // owner
					form.title, // title
					form.description, // description
					form.target,
					new Date(form.deadline).getTime(), // deadline,
					form.image,
				],
			});
            console.log("success",data)
        } catch (error) {
            console.log("failure",error)
        }
        
    }

    const getCampaigns = async () => {
        const campaigns = await contract.call('getCampaigns');

        const parsedCampaigns = campaigns.map((campaign,i) => ({
            owner:campaign.owner,
            title:campaign.title,
            description:campaign.description,
            target: ethers.utils.formatEther(campaign.target.toString()),
            deadline: campaign.deadline.toNumber(),
            amountCollected : ethers.utils.formatEther(campaign.amountCollected.toString()),
            image : campaign.image,
            pId : i

        }));

        return parsedCampaigns;
    }

    const getUserCampaigns = async () => {
        const allCampaigns = await getCampaigns();

        const filteredCampaigns = allCampaigns.filter((campaign) => campaign.owner === address);

        return filteredCampaigns;
    }

    const donate = async(pId, amount) => {
        const data = await contract.call('donateToCampaign',[pId],{value : ethers.utils.parseEther(amount) });

        return data;
    }

    const getDonations = async(pId) => {
        const donations = await contract.call('getDonators', [pId]);
        const numberofDonations = donations[0].length;

        const parsedDonations = [];

        for(let i = 0; i < numberofDonations; i++){
            parsedDonations.push({

                donator: donations[0][i],
                donation: ethers.utils.formatEther(donations[1][i].toString())

            })
        }

        return parsedDonations;

    }

    return (
        <StateContext.Provider
        value={{
            address,
            contract,
            connect,
            createCampaign : publishCampaign,
            getCampaigns,
            getUserCampaigns,
            donate,
            getDonations
        }}
        >
            {children}
        </StateContext.Provider>
    )

}

export const useStateContext = () => useContext(StateContext);