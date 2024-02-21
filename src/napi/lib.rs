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

#[napi(ts_args_type="cmd: string, argv: Array<string>, envp: Array<string>")]
pub fn execvpe(cmd: String, argv: Array, envp: Array) -> napi::Result<()> {
  // Before making the call we need to configure the stdio. This ensures we get the output of the exec'ed program.
  set_fd_cloexec().or_else(
    |e| Err(napi::Error::from_reason(e.to_string()))
  )?;

  // Setting up the arg parameters
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

  // Setting up the env parameters
  let mut envp_ = uapi::UstrPtr::new();
  for i in 0..envp.len() {
    match envp.get::<String>(i) {
      Ok(Some(value)) => {
        envp_.push(value);
        Ok(())
      },
      Err(e) => Err(napi::Error::from_reason(e.to_string())),
      _ => Ok(()),
    }?;
  }

  uapi::execvpe(
    cmd,
    &argv_,
    &envp_,
  ).or_else(
    |e| Err(napi::Error::from_reason(e.to_string()))
  )
}
