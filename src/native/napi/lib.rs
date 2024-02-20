extern crate core;

use napi_derive::napi;
use napi::bindgen_prelude::{
  Array,
};
use uapi;

fn set_fd_cloexec() -> uapi::Result<()> {
  for descriptor in 0..3 {
    // Clear the FD_CLOEXEC bit for all STDIO
    let mut flags = uapi::fcntl_getfd(descriptor)?;
    flags &= !uapi::c::FD_CLOEXEC;
    uapi::fcntl_setfd(descriptor, flags)?;
  }
  Ok(())
}

#[napi(ts_args_type="things: Array<string>")]
pub fn test(things: Array) -> () {
  match things.get::<String>(0) {
    Ok(Some(thing)) => println!("thinggy {:?}", thing),
    _ => println!("failed"),
  }
}

#[napi(ts_args_type="cmd: string, argv: Array<string>")]
pub fn execvpe(cmd: String, argv: Array) -> napi::Result<()> {
  // Before making the call we need to configure the stdio. This ensures we get the output of the exec'ed program.
  set_fd_cloexec().or_else(
    |e| Err(napi::Error::from_reason(e.to_string()))
  )?;

  let mut argv_ = uapi::UstrPtr::new();
  argv_.push(cmd.clone());
  for i in 0..argv.len() {
    match argv.get::<String>(i) {
      Ok(Some(value)) => {
        argv_.push(value);
        Ok(())
      },
      Err(e) => Err(napi::Error::from_reason(e.to_string())),
      _ => Ok(()),
    }?;
  }
  let envv = uapi::UstrPtr::new();

  uapi::execvpe(
    cmd,
    &argv_,
    &envv,
  ).or_else(
    |e| Err(napi::Error::from_reason(e.to_string()))
  )
}
