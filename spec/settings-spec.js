"use babel";

import path from "path";
import settings from "../lib/settings";

const validFile = path.join(__dirname, "fixtures", "valid.ex");

describe("Settings", () => {
  beforeEach(() => {
    waitsForPromise(() =>
      atom.packages
        .activatePackage("language-elixir")
        .then(() => atom.workspace.open(validFile))
        .then(() => atom.packages.activatePackage("atom-elixir-formatter-pulsar"))
    );

    atom.packages.triggerDeferredActivationHooks();
  });

  describe("package settings", () => {
    it("should default formatOnSave to 'always'", () => {
      expect(atom.config.get("atom-elixir-formatter-pulsar.formatOnSave")).toBe(
        "always"
      );
    });

    it("should default showErrorNotifications to true", () => {
      expect(
        atom.config.get("atom-elixir-formatter-pulsar.showErrorNotifications")
      ).toBe(true);
    });

    it("should default elixirExecutable to 'elixir'", () => {
      expect(atom.config.get("atom-elixir-formatter-pulsar.elixirExecutable")).toEqual(
        "elixir"
      );
    });
  });

  describe("getElixirPath", () => {
    it("returns elixirExecutable", () => {
      atom.config.set(
        "atom-elixir-formatter-pulsar.elixirExecutable",
        "/path/to/elixir"
      );
      expect(settings.getElixirPath()).toEqual("/path/to/elixir");
    });
  });

  describe("getMixPath", () => {
    it("returns path based on elixirExecutable setting", () => {
      atom.config.set(
        "atom-elixir-formatter-pulsar.elixirExecutable",
        "/path/to/elixir"
      );
      expect(settings.getMixPath()).toEqual("/path/to/mix");
    });
  });

  describe("quotePath", () => {
    it("returns quoted path when it contains spaces", () => {
      expect(settings.quotePath("/with spaces")).toEqual('"/with spaces"');
    });

    it("returns unquoted path when it does not contains spaces", () => {
      expect(settings.quotePath("/no/spaces")).toEqual("/no/spaces");
    });
  });

  describe("shouldFormatOnSave", () => {
    it("returns true when formatOnSave is 'always'", () => {
      atom.config.set("atom-elixir-formatter-pulsar.formatOnSave", "always");
      expect(settings.shouldFormatOnSave()).toBe(true);
    });

    it("returns true when formatOnSave is 'whenFormatterFilePresent' and formatter file present", () => {
      spyOn(settings, "isFormatterFilePresent").andReturn(true);

      atom.config.set(
        "atom-elixir-formatter-pulsar.formatOnSave",
        "whenFormatterFilePresent"
      );
      expect(settings.shouldFormatOnSave()).toBe(true);
    });

    it("returns false when formatOnSave is 'whenFormatterFilePresent' and formatter file not present", () => {
      spyOn(settings, "isFormatterFilePresent").andReturn(false);

      atom.config.set(
        "atom-elixir-formatter-pulsar.formatOnSave",
        "whenFormatterFilePresent"
      );
      expect(settings.shouldFormatOnSave()).toBe(false);
    });

    it("returns false when formatOnSave is 'never'", () => {
      atom.config.set("atom-elixir-formatter-pulsar.formatOnSave", "never");
      expect(settings.shouldFormatOnSave()).toBe(false);
    });
  });
});
