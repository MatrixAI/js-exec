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


  // Before making the call we need to configure the STD
  for descriptor in 0..3 {
    // println!("setting descriptor {:?}", descriptor);

    let mut flags = match uapi::fcntl_getfd(descriptor) {
      Err(why) => {
        // println!("why failed get fd with {:?}", why);
        panic!("Failed to call fcntl_getfd");
      }
      Ok(flags) => {
        if flags < 0 {
          // println!("Invalid flags");
          panic!("Invalid flags");
        }
        flags
      },
    };

    // clear FD_CLOEXEC bit
    flags &= !uapi::c::FD_CLOEXEC;

    match uapi::fcntl_setfd(descriptor, flags) {
      Err(why) => {
        // println!("we failed set fd with {:?}", why);
        panic!("Failed to call fcntl_setfd");
      }
      Ok(code) => {
        // println!("set ok with {:?}", code);
        code
      }
    }
  }

  let mut argv = uapi::UstrPtr::new();
  let cmd = "ll";
  argv.push(cmd);
  // argv.push("IWAZHERE");
  let envv = uapi::UstrPtr::new();
  // println!("running!");

  match uapi::execvpe(
    cmd,
    &argv,
    &envv,
  ) {
    Err(why) => {
      // println!("we failed! {:?}", why);
      panic!("Failed to call execvpe");
    },
    Ok(_) => {
      // println!("SUCC");
      42
    },
  };
  671
}
