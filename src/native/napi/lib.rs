extern crate core;

use napi_derive::napi;
use uapi;

#[napi]
pub fn test() -> bool {
  println!("Hello!");
  true
}

#[napi]
pub fn test2() -> u32 {
  // println!("Hello!");
  let mut argv = uapi::UstrPtr::new();
  let cmd = "touch";
  argv.push(cmd);
  argv.push("IWAZHERE");
  let envv = uapi::UstrPtr::new();
  println!("running!");
  match uapi::execvpe(
    cmd,
    &argv,
    &envv,
  ) {
    Err(why) => {
      println!("we failed! {:?}", why);
      123
    },
    Ok(_) => {
      println!("SUCC");
      42
    },
  };
  671
}
