import { NextFunction, Request, Response } from "express";
import { softwareCollection } from "../software/software.collection";
import { redis } from "../services/redis";
export class UserDataAccess {
    public static async getSoftwareUsers(softwareId: number): Promise<{users: SoftwareUsers[], name: string}> {
        const cacheSoftwareUser = await redis.get(`softwareUsers:${softwareId}`)
        if (cacheSoftwareUser) {
            console.log('getSoftwareUsers: cache hit')
            return JSON.parse(cacheSoftwareUser)
        }
        const softwaresResult = await softwareCollection.find<Software>({ id: softwareId }).toArray()
        redis.set(`softwareUsers:${softwareId}`, JSON.stringify({users: softwaresResult[0].users, name: softwaresResult[0].name}))
        if (softwaresResult.length > 0) {
            return softwaresResult[0]
        }
        return {users: [], name: ''}
    }
    public static async getAllSoftwareUsers(): Promise<SoftwareUsers[]> {
    
        const cacheSoftwareUsers = await redis.get('softwareUsers:ALL')
        if (cacheSoftwareUsers) {
            console.log('getAllSoftwareUsers: cache hit')
            return JSON.parse(cacheSoftwareUsers)
        }
        const softwareUsers = (await softwareCollection.distinct('users') as SoftwareUsers[]).sort((a, b) => a.name.localeCompare(b.name))
        await redis.set('softwareUsers:ALL', JSON.stringify(softwareUsers))
        return softwareUsers
    }
}