/****** Run this script to create a new user, schema, tables, and SPs for PlatyNEM ******/
-- !!!IMPORTANT!!! Make sure you change "use" to the correct db.
-- Also make sure you change all instances of "platynem" to the right value.
-- By default, the schema/user will be named "platynem", and will be assigned to the "platynem login"
USE [platynem-test-1]
GO
/****** Object:  Schema [platynem]    Script Date: 7/28/2015 12:02:46 Will ******/
CREATE SCHEMA [platynem]
GO
/****** Object:  User [platynem]    Script Date: 7/28/2015 12:02:45 Will ******/
CREATE USER [platynem] FOR LOGIN [platynem] WITH DEFAULT_SCHEMA=[platynem]
GO
ALTER ROLE [db_execute] ADD MEMBER [platynem]
GO
GRANT EXECUTE ON SCHEMA::[platynem] TO [platynem]
GO
/****** Object:  Table [platynem].[posts]    Script Date: 7/28/2015 12:02:46 Will ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [platynem].[posts](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[userid] [int] NOT NULL,
	[title] [nvarchar](255) NOT NULL,
	[slug] [nvarchar](255) NOT NULL,
	[content] [nvarchar](max) NULL,
	[created] [datetime2](7) NULL,
	[published] [bit] NULL,
PRIMARY KEY CLUSTERED
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON),
 CONSTRAINT [UQ_Post_Slug] UNIQUE NONCLUSTERED
(
	[slug] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON)
)

GO
/****** Object:  Table [platynem].[users]    Script Date: 7/28/2015 12:02:46 Will ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [platynem].[users](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[email] [nvarchar](255) NOT NULL,
	[firstname] [nvarchar](50) NOT NULL,
	[lastname] [nvarchar](50) NOT NULL,
	[salt] [nvarchar](255) NOT NULL,
	[hashedpassword] [nvarchar](255) NOT NULL,
	[role] [nvarchar](50) NULL,
	[avatar] [nvarchar](255) NULL,
	[resetpasswordtoken] [nvarchar](255) NULL,
	[resetpasswordexpires] [nvarchar](255) NULL,
PRIMARY KEY CLUSTERED
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON)
)

GO
ALTER TABLE [platynem].[posts]  WITH CHECK ADD  CONSTRAINT [FK_Post_Userid] FOREIGN KEY([userid])
REFERENCES [platynem].[users] ([id])
ON UPDATE CASCADE
ON DELETE CASCADE
GO
ALTER TABLE [platynem].[posts] CHECK CONSTRAINT [FK_Post_Userid]
GO
/****** Object:  StoredProcedure [platynem].[CreateUserPasswordResetToken]    Script Date: 7/28/2015 12:02:46 Will ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE PROCEDURE [platynem].[CreateUserPasswordResetToken]
	-- Add the parameters for the stored procedure here
	@email nvarchar(255),
	@resetpasswordtoken nvarchar(255),
	@days int = null
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

	declare @userid int;
	declare @date datetime2(0);

    set @userid = (select id from platynem.users where email = @email);
	if (@days is not null)
		set @date = dateadd(day, @days, getdate());
	else
		set @date = null;

	if(@userid is not null)
		begin
		update platynem.users
			set resetpasswordtoken = @resetpasswordtoken,
				resetpasswordexpires = @date
			where id = @userid;
		end;

	select top 1 * from platynem.users where id = @userid;
END

GO
/****** Object:  StoredProcedure [platynem].[DeletePost]    Script Date: 7/28/2015 12:02:46 Will ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
CREATE PROCEDURE [platynem].[DeletePost]
	-- Add the parameters for the stored procedure here
	@id int
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

	delete from platynem.posts
		where id = @id;
END

GO
/****** Object:  StoredProcedure [platynem].[DeleteUser]    Script Date: 7/28/2015 12:02:46 Will ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


CREATE PROCEDURE [platynem].[DeleteUser]
	-- Add the parameters for the stored procedure here
	@id int
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

	delete from platynem.users
		where id = @id;
END


GO
/****** Object:  StoredProcedure [platynem].[GetPost]    Script Date: 7/28/2015 12:02:46 Will ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
CREATE PROCEDURE [platynem].[GetPost]
	-- Add the parameters for the stored procedure here
	@slug nvarchar(255)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

	declare @userid int;

	select top 1 * from platynem.posts
		where slug = @slug;

	set @userid = (select top 1 userid from platynem.posts
		where slug = @slug);

	select top 1 * from platynem.users
		where id = @userid;
END

GO
/****** Object:  StoredProcedure [platynem].[GetPosts]    Script Date: 7/28/2015 12:02:46 Will ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
CREATE PROCEDURE [platynem].[GetPosts]
	-- Add the parameters for the stored procedure here
	@published bit = NULL,
	@startingrow int,
	@rowcount int
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

	if(@rowcount = 0)
		BEGIN
			set @rowcount = 2147483647;
		END;

	select * INTO #gp1 from platynem.posts
		where published = coalesce(@published, 1) or
		published = coalesce(@published, 0)
		order by created desc
		OFFSET @startingrow ROWS FETCH NEXT @rowcount ROWS ONLY;

	select * from #gp1 as posts;

	select distinct u.* from platynem.users u
		inner join #gp1 p on u.id = p.userid;

	drop table #gp1;
END

GO
/****** Object:  StoredProcedure [platynem].[GetUser]    Script Date: 7/28/2015 12:02:46 Will ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE PROCEDURE [platynem].[GetUser]
	-- Add the parameters for the stored procedure here
	@id int
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

	select top 1 * from platynem.users
		where id = @id;
END

GO
/****** Object:  StoredProcedure [platynem].[GetUserBy]    Script Date: 7/28/2015 12:02:46 Will ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE PROCEDURE [platynem].[GetUserBy]
	-- Add the parameters for the stored procedure here
	@email nvarchar(255) = null,
	@resetpasswordtoken nvarchar(255) = null
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    select top 1 * from platynem.users
	where
		email = @email or
		(resetpasswordtoken = @resetpasswordtoken and
		(
			resetpasswordexpires = NULL or
			resetpasswordexpires > getdate()
		));
END

GO
/****** Object:  StoredProcedure [platynem].[GetUsers]    Script Date: 7/28/2015 12:02:46 Will ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE PROCEDURE [platynem].[GetUsers]
	-- Add the parameters for the stored procedure here
	@startingrow int,
	@rowcount int
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

	if(@rowcount = 0)
		BEGIN
			set @rowcount = 2147483647;
		END;

	select * from platynem.users
		order by firstname, lastname
		OFFSET @startingrow ROWS FETCH NEXT @rowcount ROWS ONLY;
END

GO
/****** Object:  StoredProcedure [platynem].[InsertPost]    Script Date: 7/28/2015 12:02:46 Will ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
CREATE PROCEDURE [platynem].[InsertPost]
	-- Add the parameters for the stored procedure here
	@userid int,
	@title nvarchar(255),
	@slug nvarchar(255),
	@content nvarchar(MAX) = null,
	@created datetime2 = null,
	@published bit = null
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

	INSERT INTO platynem.posts(
		userid,
		title,
		slug,
		content,
		created,
		published)
	VALUES(
		@userid,
		@title,
		@slug,
		@content,
		@created,
		@published);

	SELECT scope_identity() as id;
END

GO
/****** Object:  StoredProcedure [platynem].[InsertUser]    Script Date: 7/28/2015 12:02:46 Will ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE PROCEDURE [platynem].[InsertUser]
	-- Add the parameters for the stored procedure here
	@firstname nvarchar(255),
	@lastname nvarchar(255),
	@email nvarchar(255),
	@role nvarchar(20),
	@avatar nvarchar(255) = null,
	@hashedpassword nvarchar(255) = null,
	@salt nvarchar(255) = null,
	@resetpasswordtoken nvarchar(255) = null,
	@resetpasswordexpires datetime2(0) = null
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    -- Insert statements for procedure here
	INSERT INTO platynem.users(
		firstname,
		lastname,
		email,
		role,
		avatar,
		hashedpassword,
		salt,
		resetpasswordtoken,
		resetpasswordexpires)
	VALUES(
		@firstname,
		@lastname,
		@email,
		@role,
		@avatar,
		@hashedpassword,
		@salt,
		@resetpasswordtoken,
		@resetpasswordexpires);

	SELECT scope_identity() as id;
END

GO
/****** Object:  StoredProcedure [platynem].[IsUserUnique]    Script Date: 7/28/2015 12:02:46 Will ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


CREATE PROCEDURE [platynem].[IsUserUnique]
	-- Add the parameters for the stored procedure here
	@email nvarchar(255),
	@id int = null
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

	declare @emailexists int;
    -- Insert statements for procedure here
	If @id is not null
	begin
		set @emailexists = (select count(*) as email from platynem.users where email = @email and id != @id);
	end
	else
	begin
		set @emailexists = (select count(*) as email from platynem.users where email = @email);
	end

	select @emailexists as email;
END


GO
/****** Object:  StoredProcedure [platynem].[UpdatePost]    Script Date: 7/28/2015 12:02:46 Will ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
CREATE PROCEDURE [platynem].[UpdatePost]
	-- Add the parameters for the stored procedure here
	@id int,
	@userid int,
	@title nvarchar(255),
	@slug nvarchar(255),
	@content nvarchar(MAX) = null,
	@created datetime2 = null,
	@published bit = null
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

	UPDATE platynem.posts
		SET
			userid = @userid,
			title = @title,
			slug = @slug,
			content = @content,
			created = @created,
			published = coalesce(@published, published)
		where
			id = @id;
END

GO
/****** Object:  StoredProcedure [platynem].[UpdateUser]    Script Date: 7/28/2015 12:02:46 Will ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE PROCEDURE [platynem].[UpdateUser]
	-- Add the parameters for the stored procedure here
	@id int,
	@firstname nvarchar(255),
	@lastname nvarchar(255),
	@email nvarchar(255),
	@role nvarchar(20),
	@avatar nvarchar(255) = null,
	@hashedpassword nvarchar(255) = null,
	@salt nvarchar(255) = null,
	@resetpasswordtoken nvarchar(255) = null,
	@resetpasswordexpires datetime2(0) = null
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    -- Insert statements for procedure here
	UPDATE platynem.users
		set
			firstname = @firstname,
			lastname = @lastname,
			email = @email,
			role = @role,
			avatar = @avatar,
			hashedpassword = coalesce(@hashedpassword, hashedpassword),
			salt = coalesce(@salt, salt),
			resetpasswordtoken = case
				when @hashedpassword is not null then null
				else coalesce(@resetpasswordtoken, resetpasswordtoken)
				end,
			resetpasswordexpires = case
				when @hashedpassword is not null then null
				else coalesce(@resetpasswordexpires, resetpasswordexpires)
				end

		where
			id = @id;
END

GO
