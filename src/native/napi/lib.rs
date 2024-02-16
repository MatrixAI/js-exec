extern crate core;

use napi_derive::napi;

#[napi]
pub fn test() -> bool {
  println!("Hello!");
  true
}
