defmodule HeatTagsWeb.MessagesController do
  use HeatTagsWeb, :controller

  def create(conn, params) do
    IO.inspect(params)

    # Pipe operator
    conn
    |> text("RECEBI A REQUISIÇÃO")

    # text(conn, "RECEBI A REQUESIÇÃO")
  end
end

