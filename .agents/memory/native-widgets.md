---
name: Native widget builds
description: Native build and preview constraints for the converter's Android and iOS home-screen widgets.
---

Home-screen widget extensions are not available in Expo Go. The converter's widget behavior must be verified with a native development build; Metro/web preview can only validate the app bundle and configuration.

**Why:** Widget providers and extension targets are native platform components, and the preview workflow intentionally runs through Expo Go.

**How to apply:** Keep widget registration in platform-specific native config plugins, use the shared rates proxy for background fetches, and treat device/native-build verification as a separate step.