use anchor_lang::error_code;

#[error_code]
pub enum ProgramErrorCode {
    #[msg("Invalid Mint account space")]
    InvalidMintAccountSpace,
    #[msg("Cant initialize metadata_pointer")]
    CantInitializeMetadataPointer,
    #[msg("Cant create metadata account")]
    CantCreateMetadataAccount,
    #[msg("Cant create master edition account")]
    CantCreateMasterEditionAccount,
    #[msg("Cant create token account")]
    CantCreateTokenAccount,
    #[msg("Cant create metadata pointer")]
    CantCreateMetadataPointer,
}

#[error_code]
pub enum GameErrorCode {
    #[msg("Wrong Authority")]
    WrongAuthority,
}