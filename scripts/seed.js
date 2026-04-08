import mongoose from "mongoose";
import {faker} from "@faker-js/faker";
import Category from "../models/Category.ts";
import Customer from "../models/Customer.ts";
import Service from "../models/Service.ts";
import Staff from "../models/Staff.ts";
import Appointment from "../models/Appointment.ts";

const MONGO_URI = "mongodb://127.0.0.1:27017/ayarlio_db";

function getArg(name) {
    const arg = process.argv.find((a) => a.startsWith(`--${name}=`));
    return arg ? arg.split("=")[1] : null;
}

function generateCode() {
    return faker.string.alphanumeric(8).toUpperCase() + Date.now();
}

function randomDate(durationMinutes = 60) {
    const start = faker.date.soon({days: 10});
    const end = new Date(start);
    end.setMinutes(end.getMinutes() + durationMinutes);
    return {start, end};
}

function safeString(str) {
    return str
        .normalize("NFKD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-zA-Z0-9]/g, "")
        .toLowerCase();
}

async function seed() {
    try {
        const tenantIdStr = getArg("tenantId");
        if (!tenantIdStr) throw new Error("tenantId gerekli");

        const TENANT_ID = new mongoose.Types.ObjectId(tenantIdStr);

        await mongoose.connect(MONGO_URI);
        console.log("Mongo connected");

        await Promise.all([
            Category.deleteMany({tenantId: TENANT_ID}),
            Customer.deleteMany({tenantId: TENANT_ID}),
            Service.deleteMany({tenantId: TENANT_ID}),
            Staff.deleteMany({tenantId: TENANT_ID}),
            Appointment.deleteMany({tenantId: TENANT_ID}),
        ]);

        console.log("Old data cleared");

        const categories = [
            "Saç",
            "Bakım",
            "Masaj",
            "Cilt",
            "Tırnak",
        ].map((name) => ({
            tenantId: TENANT_ID,
            name,
        }));

        const createdCategories = await Category.insertMany(categories);

        const customers = [];
        for (let i = 0; i < 100; i++) {
            const first = safeString(faker.person.firstName());
            const last = safeString(faker.person.lastName());

            customers.push({
                tenantId: TENANT_ID,
                name: `${first} ${last}`,
                email: `${first}.${last}.${i}@gmail.com`.toLowerCase(),
                phone: faker.phone.number("+90 5## ### ## ##"),
                isActive: true,
            });
        }

        const createdCustomers = await Customer.insertMany(customers);

        const staffs = [];


        for (let i = 0; i < 5; i++) {
            const first = safeString(faker.person.firstName());
            const last = safeString(faker.person.lastName());
            staffs.push({
                tenantId: TENANT_ID,
                name: faker.person.fullName(),
                role: faker.person.jobTitle(),
                email: `${first}.${last}.${i}@gmail.com`.toLowerCase(),
                phone: faker.phone.number("+90 5## ### ## ##"),
                status: "active",
                startTime: "09:00",
                endTime: "18:00",
                workDays: ["monday", "tuesday", "wednesday", "thursday", "friday"],
            });
        }

        const createdStaffs = await Staff.insertMany(staffs);

        const services = [];

        for (let i = 0; i < 10; i++) {
            const duration = faker.number.int({min: 30, max: 120});

            services.push({
                tenantId: TENANT_ID,
                name: faker.commerce.productName(),
                category: faker.helpers.arrayElement(createdCategories).name,
                description: faker.lorem.sentence(),
                duration: {
                    value: duration,
                    unit: "minutes",
                },
                price: faker.number.int({min: 100, max: 1000}),
                currency: "TRY",
                isActive: true,
                staffIds: createdStaffs.map((s) => s._id),
            });
        }

        const createdServices = await Service.insertMany(services);

        const appointments = [];

        for (let i = 0; i < 200; i++) {
            const customer = faker.helpers.arrayElement(createdCustomers);
            const service = faker.helpers.arrayElement(createdServices);
            const staff = faker.helpers.arrayElement(createdStaffs);

            const {start, end} = randomDate(service.duration.value);

            appointments.push({
                tenantId: TENANT_ID,
                customerId: customer._id,
                serviceId: service._id,
                staffId: staff._id,
                code: generateCode() + i,
                startTime: start,
                endTime: end,
                status: faker.helpers.arrayElement([
                    "pending",
                    "confirmed",
                    "completed",
                    "cancelled",
                ]),
                notes: faker.lorem.sentence(),
            });
        }

        const createdAppointments = await Appointment.insertMany(appointments, {
            ordered: false,
        });

        console.log("---- RESULT ----");
        console.log("Categories:", createdCategories.length);
        console.log("Customers:", createdCustomers.length);
        console.log("Staff:", createdStaffs.length);
        console.log("Services:", createdServices.length);
        console.log("Appointments:", createdAppointments.length);

        console.log("🎉 SEED COMPLETED");
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

seed().then(r => console.log(r));