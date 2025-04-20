//character_data.rs
use anchor_lang::prelude::*;

#[account]
pub struct CharacterMetadata {
    pub authority: Pubkey,
    pub name: String,
    pub class: String,
    pub weapon: String,
    pub level: u8,
    pub xp: u32,
}

impl CharacterMetadata {
    pub const LEN: usize =
        32 +
            (4 + 32) +
            (4 + 32) +
            (4 + 32) +
            1 +
            4;

    pub fn gain_xp(&mut self, amount: u32) {
        self.xp += amount;
    }

    pub fn maybe_level_up(&mut self) {
        let threshold = self.level as u32 * 100;
        if self.xp >= threshold {
            self.level += 1;
            self.xp = 0;
        }
    }

    pub fn print(&self) {
        msg!(
            "Level: {} | XP: {} | Class: {} | Weapon: {}",
            self.level,
            self.xp,
            self.class,
            self.weapon
        );
    }
}
