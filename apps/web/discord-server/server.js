// import 'dotenv/config';
// import express from 'express';
// import cors from 'cors';
// import {
//   InteractionType,
//   InteractionResponseType,
//   verifyKeyMiddleware,
// } from 'discord-interactions';
// import { BASE_URL, DISCORD_TOKEN, GUILD_ID, NFT_OWNER_ROLE_ID,  PUBLIC_KEY } from './constant.js';
const express = require('express');
const cors = require('cors');
const { InteractionType, InteractionResponseType, verifyKeyMiddleware } = require('discord-interactions');
const { BASE_URL, DISCORD_TOKEN, GUILD_ID, NFT_OWNER_ROLE_ID, PUBLIC_KEY } = require('./constant.js');


const app = express();
app.use(express.json());
app.use(cors());

app.post('/interactions', verifyKeyMiddleware(PUBLIC_KEY), async function (req, res) {
  const { type, data } = req.body;
console.log({type, data})
  if (type === InteractionType.PING) {
    return res.send({ type: InteractionResponseType.PONG });
  }

  if (type === InteractionType.APPLICATION_COMMAND) {
    const { name } = data;

    if (name === 'verify') {
      const userId = req.body.member?.user.id || req.body.user.id;
      const verifyUrl = `${BASE_URL}/verify?userId=${userId}`;

      return res.send({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          content: "Click below to verify your NFT ownership!",
          components: [{
            type: 1,
            components: [{
              type: 2,
              style: 5,
              label: "Verify NFT",
              url: verifyUrl
            }]
          }],
          flags: 64
        },
      });
    }
  }
});

app.post('/api/verify-role', async (req, res) => {
  const { userId } = req.body;
  console.log({ userId, guildId: GUILD_ID, NFT_OWNER_ROLE_ID: NFT_OWNER_ROLE_ID, discordToken: DISCORD_TOKEN})
  try {
    // Assign NFT Owner role
    const response = await fetch(
      `https://discord.com/api/v10/guilds/${GUILD_ID}/members/${userId}/roles/${NFT_OWNER_ROLE_ID}`,
      {
        method: 'PUT',
        headers: {
          'Authorization': `Bot ${DISCORD_TOKEN}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to assign role');
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to verify' });
  }
});

const PORT =8050;
app.listen(PORT, () => {
  console.log('Server is running on port', PORT);
});