import prisma from "../lib/prisma.js";
import { FastifyRequest, FastifyReply } from 'fastify';
import {  } from "../services/friendsService.js";
import Fastify from 'fastify';
import bcrypt from 'bcrypt';
import prisma from "../lib/prisma.js";

const fastify = Fastify({ logger: true });
