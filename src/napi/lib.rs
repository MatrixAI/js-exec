extern crate core;

use napi_derive::napi;
use napi::bindgen_prelude::{
  Array,
  Object,
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

#[napi(ts_args_type="cmd: string, argv: Array<string>, envp: Record<string, string>")]
pub fn execvp(cmd: String, argv: Array, envp: Object) -> napi::Result<()> {
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
  let keys = Object::keys(&envp).or_else(
    |e| Err(napi::Error::from_reason(e.to_string()))
  )?;
  for key in keys.iter() {
    let value = match envp.get::<String, String>(key.clone()) {
      Ok(Some(value)) => Ok(value),
      Ok(None) => panic!("asd"),
      Err(e) => Err(e),
    }.or_else(
      |e| Err(napi::Error::from_reason(e.to_string()))
    )?;
    std::env::set_var(key, value);
  }

  uapi::execvp(
    cmd,
    &argv_,
  ).or_else(
    |e| Err(napi::Error::from_reason(e.to_string()))
  )
}
