defmodule HeatTags.Message do
  use Ecto.Schema

  import Ecto.Changeset

  @required_params [:message, :username, :email]

  schema "messages" do
    field :message, :string
    field :username, :string
    field :email, :string

    timestamps()
  end

  def changeset(params) do
    %__MODULE__{}
    |> cast(params, @required_params)
    |> IO.inspect()
  end
end
