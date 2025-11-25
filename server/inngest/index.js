import { Inngest } from "inngest";
import prisma from "../config/prisma.js";

// Create a client to send and receive events
export const inngest = new Inngest({ id: "nimo" });

// Inngest function to save user data in database
const SyncUserCreation = inngest.createFunction(
    {id : 'sync-user-from-clerk'},
    {event : 'clerk/user.created'},
    async({event}) => {
        const {data} = event
        await prisma.user.create({
            data : {
                id : data.id,
                email : data?.email_addresses[0]?.email_addres,
                name : data.first_name + " " + data?.last_name,
                image : data?.image_url
            }
        })
    }
)

// Inngest function to delete user from database
const SyncUserDeletion = inngest.createFunction(
    {id : 'delete-user-from-clerk'},
    {event : 'clerk/user.deleted'},
    async({event}) => {
        const {data} = event
        await prisma.user.delete({
            where : {
                id : data.id
            }
        })
    }
)

// Inngest function to update user from database
const SyncUserUpdation = inngest.createFunction(
    {id : 'update-user-from-clerk'},
    {event : 'clerk/user.updated'},
    async({event}) => {
        const {data} = event
        await prisma.user.update({
            where : {
                 id : data.id,
            },
            data : {
                email : data?.email_addresses[0]?.email_addres,
                name : data.first_name + " " + data?.last_name,
                image : data?.image_url
            }
        })
    }
)

// Create an empty array where we'll export future Inngest functions
export const functions = [SyncUserCreation , SyncUserDeletion , SyncUserUpdation];