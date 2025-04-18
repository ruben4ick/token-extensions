//character_data.rs
use anchor_lang::prelude::*;

#[account]
pub struct CharacterMetadata {
    pub authority: Pubkey,
    pub name: String,
    pub class: String,
    pub level: u8,
    pub experience: u32,
    pub weapon: String,
}

impl CharacterMetadata {
    pub const LEN: usize = 8 + 32 + (4 + 32) * 4 + 1 + 4; // приблизна оцінка
}
