/**
 * GENERATED CODE - DO NOT MODIFY
 */
import express from 'express';
import { ValidationResult, BlobRef } from '@atproto/lexicon';
import { lexicons } from '../../../../lexicons';
import { isObj, hasProp } from '../../../../util';
import { CID } from 'multiformats/cid';
import { HandlerAuth } from '@atproto/xrpc-server';

export interface QueryParams {
  /** The handle to resolve. If not supplied, will resolve the host's own handle. */
  handle?: string
}

export type InputSchema = undefined

export interface OutputSchema {
  did: string
  [k: string]: unknown
}

export type HandlerInput = undefined

export interface HandlerSuccess {
  encoding: 'application/json'
  body: OutputSchema
}

export interface HandlerError {
  status: number
  message?: string
}

export type HandlerOutput = HandlerError | HandlerSuccess
export type Handler<HA extends HandlerAuth = never> = (ctx: {
  auth: HA
  params: QueryParams
  input: HandlerInput
  req: express.Request
  res: express.Response
}) => Promise<HandlerOutput> | HandlerOutput
